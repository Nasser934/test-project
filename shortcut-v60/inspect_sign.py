from __future__ import annotations
import hashlib, json, plistlib, traceback, urllib.error, urllib.request
from collections import Counter
from pathlib import Path

ROOT=Path('shortcut-v60'); BUILD=Path('build'); BUILD.mkdir(exist_ok=True)
PREFIX='🕌 ذكي |'
MAIN_INPUT=ROOT/'منبه الصلوات الذكي V6.1_unsigned.shortcut'
SETTINGS_INPUT=ROOT/'إعدادات منبه الصلوات الذكي V6.1_unsigned.shortcut'
MAIN_SOURCE=BUILD/'Prayer_Alarm_Smart_V6_1_Source.shortcut'
SETTINGS_SOURCE=BUILD/'Prayer_Alarm_Settings_V6_1_Source.shortcut'
MAIN_SIGNED=BUILD/'Prayer_Alarm_Smart_V6_1_Signed.shortcut'
SETTINGS_SIGNED=BUILD/'Prayer_Alarm_Settings_V6_1_Signed.shortcut'
DIAG=BUILD/'v6_1-diagnostics.txt'

def content_filter(prop,value):
    return {'Value':{'WFActionParameterFilterPrefix':1,'WFContentPredicateBoundedDate':False,'WFActionParameterFilterTemplates':[{'Removable':True,'Property':prop,'Operator':99,'Values':{'String':value,'Unit':4}}]},'WFSerializationType':'WFContentPredicateTableTemplate'}

def load(path): return plistlib.loads(path.read_bytes())

def patch_offset_duration(actions):
    nums=[a for a in actions if a.get('WFWorkflowActionIdentifier')=='is.workflow.actions.detect.number']
    if len(nums)!=1: raise ValueError(f'Expected one Get Numbers action, found {len(nums)}')
    p=nums[0]['WFWorkflowActionParameters']; u=p['UUID']; n=p.get('CustomOutputName','GetNumbers')
    removed=patched=0
    for i,a in enumerate(actions):
        ap=a.get('WFWorkflowActionParameters',{})
        if a.get('WFWorkflowActionIdentifier')=='is.workflow.actions.setvariable' and ap.get('WFVariableName')=='offsetDuration':
            actions[i]={'WFWorkflowActionIdentifier':'is.workflow.actions.nothing'}; removed+=1
    for a in actions:
        if a.get('WFWorkflowActionIdentifier')=='is.workflow.actions.adjustdate' and "'VariableName': 'targetTime'" in repr(a.get('WFWorkflowActionParameters',{}).get('WFDate',{})):
            a['WFWorkflowActionParameters']['WFDuration']={'Value':{'Unit':'min','Magnitude':{'OutputUUID':u,'Type':'ActionOutput','OutputName':n}},'WFSerializationType':'WFQuantityFieldValue'}; patched+=1
    if removed!=1 or patched!=1: raise ValueError(f'duration patch failed removed={removed} patched={patched}')

def normalize(shortcut,name,is_main):
    shortcut['WFWorkflowName']=name; actions=shortcut.get('WFWorkflowActions',[])
    if is_main: patch_offset_duration(actions)
    ids=Counter(a.get('WFWorkflowActionIdentifier','') for a in actions)
    if is_main:
        if len(actions)>420: raise ValueError(f'Main shortcut unexpectedly large: {len(actions)} actions')
        alarms=[a for a in actions if a.get('WFWorkflowActionIdentifier')=='com.apple.mobiletimer-framework.MobileTimerIntents.MTGetAlarmsIntent']
        if len(alarms)!=1: raise ValueError('Expected one Get Alarms')
        p=alarms[0].setdefault('WFWorkflowActionParameters',{}); p['ShowWhenRun']=False; p['WFContentItemLimitEnabled']=False; p['WFContentItemInputParameter']='Library'; p['WFContentItemFilter']=content_filter('label',PREFIX)
        rem=[a for a in actions if a.get('WFWorkflowActionIdentifier')=='is.workflow.actions.filter.reminders']
        if len(rem)!=1: raise ValueError('Expected one Find Reminders')
        rp=rem[0].setdefault('WFWorkflowActionParameters',{}); rp['WFContentItemLimitEnabled']=False; rp['WFContentItemFilter']=content_filter('Title',PREFIX)
        for x in ['is.workflow.actions.choosefromlist','is.workflow.actions.ask','is.workflow.actions.alert']:
            if ids[x]: raise ValueError(f'Interactive action in main: {x}')
        if ids['is.workflow.actions.downloadurl']!=1: raise ValueError('Expected exactly one API request')
        if ids['is.workflow.actions.repeat.each']!=1: raise ValueError(f'Expected one repeat loop, found {ids["is.workflow.actions.repeat.each"]}')
    data=plistlib.dumps(shortcut,fmt=plistlib.FMT_XML,sort_keys=False)
    return data,ids,len(actions)

def sign(source,name):
    payload=json.dumps({'shortcutName':name,'shortcut':source.decode('utf-8')},ensure_ascii=False).encode()
    req=urllib.request.Request('https://hubsign.routinehub.services/sign',data=payload,headers={'Content-Type':'application/json','User-Agent':'cherri/2.3.0','Accept':'*/*'},method='POST')
    with urllib.request.urlopen(req,timeout=180) as r: body=r.read()
    if not body.startswith(b'AEA1'): raise ValueError(f'bad prefix {body[:20]!r}')
    return body

log=[]
try:
    ms,mi,ma=normalize(load(MAIN_INPUT),'منبه الصلوات الذكي V6.1',True)
    ss,si,sa=normalize(load(SETTINGS_INPUT),'إعدادات منبه الصلوات الذكي V6.1',False)
    MAIN_SOURCE.write_bytes(ms); SETTINGS_SOURCE.write_bytes(ss)
    msign=sign(ms,'منبه الصلوات الذكي V6.1'); ssign=sign(ss,'إعدادات منبه الصلوات الذكي V6.1')
    MAIN_SIGNED.write_bytes(msign); SETTINGS_SIGNED.write_bytes(ssign)
    log += ['signed=true',f'main_actions={ma}',f'settings_actions={sa}',f'main_signed_bytes={len(msign)}',f'settings_signed_bytes={len(ssign)}',f'main_sha256={hashlib.sha256(msign).hexdigest()}',f'settings_sha256={hashlib.sha256(ssign).hexdigest()}',f'main_prefix={msign[:4]!r}',f'settings_prefix={ssign[:4]!r}',f'api_requests={mi["is.workflow.actions.downloadurl"]}',f'repeat_loops={mi["is.workflow.actions.repeat.each"]}']
except Exception as e:
    log.append(f'exception={type(e).__name__}: {e}'); log.append(traceback.format_exc()); raise
finally:
    DIAG.write_text('\n'.join(log),encoding='utf-8'); print('\n'.join(log),flush=True)
