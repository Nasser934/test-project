from __future__ import annotations

import hashlib
import json
import plistlib
import traceback
import urllib.error
import urllib.request
from collections import Counter
from pathlib import Path

ROOT = Path('shortcut-v60')
BUILD = Path('build')
BUILD.mkdir(exist_ok=True)
PREFIX = '🕌 ذكي |'

MAIN_INPUT = ROOT / 'منبه الصلوات الذكي V6.0_unsigned.shortcut'
SETTINGS_INPUT = ROOT / 'إعدادات منبه الصلوات الذكي V6.0_unsigned.shortcut'

MAIN_SOURCE = BUILD / 'Prayer_Alarm_Smart_V6_0_Source.shortcut'
SETTINGS_SOURCE = BUILD / 'Prayer_Alarm_Settings_V6_0_Source.shortcut'
MAIN_SIGNED = BUILD / 'Prayer_Alarm_Smart_V6_0_Signed.shortcut'
SETTINGS_SIGNED = BUILD / 'Prayer_Alarm_Settings_V6_0_Signed.shortcut'
DIAG = BUILD / 'v6-diagnostics.txt'


def content_filter(property_name: str, value: str) -> dict:
    return {
        'Value': {
            'WFActionParameterFilterPrefix': 1,
            'WFContentPredicateBoundedDate': False,
            'WFActionParameterFilterTemplates': [
                {
                    'Removable': True,
                    'Property': property_name,
                    'Operator': 99,
                    'Values': {'String': value, 'Unit': 4},
                }
            ],
        },
        'WFSerializationType': 'WFContentPredicateTableTemplate',
    }


def load(path: Path) -> dict:
    if not path.exists():
        raise FileNotFoundError(path)
    return plistlib.loads(path.read_bytes())


def normalize_and_patch(shortcut: dict, name: str, is_main: bool) -> tuple[bytes, Counter]:
    shortcut['WFWorkflowName'] = name
    actions = shortcut.get('WFWorkflowActions', [])
    ids = Counter(a.get('WFWorkflowActionIdentifier', '') for a in actions)

    if is_main:
        alarm_get = [a for a in actions if a.get('WFWorkflowActionIdentifier') == 'com.apple.mobiletimer-framework.MobileTimerIntents.MTGetAlarmsIntent']
        if len(alarm_get) != 1:
            raise ValueError(f'Expected exactly one Get Alarms action, found {len(alarm_get)}')
        p = alarm_get[0].setdefault('WFWorkflowActionParameters', {})
        p['WFContentItemLimitNumber'] = 1
        p['WFContentItemInputParameter'] = 'Library'
        p['ShowWhenRun'] = False
        p['WFContentItemLimitEnabled'] = False
        p['WFContentItemFilter'] = content_filter('label', PREFIX)

        reminder_filters = [a for a in actions if a.get('WFWorkflowActionIdentifier') == 'is.workflow.actions.filter.reminders']
        if len(reminder_filters) != 1:
            raise ValueError(f'Expected exactly one Find Reminders action, found {len(reminder_filters)}')
        rp = reminder_filters[0].setdefault('WFWorkflowActionParameters', {})
        rp['WFContentItemLimitNumber'] = 1
        rp['WFContentItemLimitEnabled'] = False
        rp['WFContentItemFilter'] = content_filter('Title', PREFIX)

        required = {
            'com.apple.clock.DeleteAlarmIntent': 1,
            'com.apple.mobiletimer-framework.MobileTimerIntents.MTCreateAlarmIntent': 1,
            'is.workflow.actions.addnewreminder': 1,
            'is.workflow.actions.removereminders': 1,
            'is.workflow.actions.downloadurl': 2,
            'is.workflow.actions.documentpicker.open': 3,
            'is.workflow.actions.documentpicker.save': 4,
        }
        for action_id, minimum in required.items():
            if ids[action_id] < minimum:
                raise ValueError(f'Missing required main action {action_id}: {ids[action_id]}')

        forbidden = [
            'is.workflow.actions.choosefromlist',
            'is.workflow.actions.ask',
            'is.workflow.actions.alert',
            'is.workflow.actions.openurl',
            'is.workflow.actions.openurls',
        ]
        for action_id in forbidden:
            if ids[action_id]:
                raise ValueError(f'Interactive action remains in main shortcut: {action_id}')
    else:
        if ids['is.workflow.actions.choosefromlist'] < 5:
            raise ValueError('Settings shortcut does not contain the expected selection menus')
        if ids['is.workflow.actions.ask'] < 5:
            raise ValueError('Settings shortcut does not contain the expected numeric/text questions')
        if ids['is.workflow.actions.documentpicker.save'] < 1:
            raise ValueError('Settings shortcut does not save settings')

    serialized = plistlib.dumps(shortcut, fmt=plistlib.FMT_XML, sort_keys=False)
    return serialized, ids


def sign(source: bytes, shortcut_name: str) -> bytes:
    payload = json.dumps(
        {'shortcutName': shortcut_name, 'shortcut': source.decode('utf-8')},
        ensure_ascii=False,
    ).encode('utf-8')
    req = urllib.request.Request(
        'https://hubsign.routinehub.services/sign',
        data=payload,
        headers={
            'Content-Type': 'application/json',
            'User-Agent': 'cherri/2.3.0',
            'Accept': '*/*',
        },
        method='POST',
    )
    with urllib.request.urlopen(req, timeout=180) as response:
        body = response.read()
        if response.status != 200:
            raise RuntimeError(f'HubSign status {response.status}')
    if not body.startswith(b'AEA1'):
        raise ValueError(f'Invalid HubSign prefix: {body[:20]!r}')
    return body


log: list[str] = []
try:
    main_source, main_ids = normalize_and_patch(load(MAIN_INPUT), 'منبه الصلوات الذكي V6.0', True)
    settings_source, settings_ids = normalize_and_patch(load(SETTINGS_INPUT), 'إعدادات منبه الصلوات الذكي V6.0', False)

    MAIN_SOURCE.write_bytes(main_source)
    SETTINGS_SOURCE.write_bytes(settings_source)

    main_signed = sign(main_source, 'منبه الصلوات الذكي V6.0')
    settings_signed = sign(settings_source, 'إعدادات منبه الصلوات الذكي V6.0')
    MAIN_SIGNED.write_bytes(main_signed)
    SETTINGS_SIGNED.write_bytes(settings_signed)

    log.extend([
        'signed=true',
        f'main_actions={sum(main_ids.values())}',
        f'settings_actions={sum(settings_ids.values())}',
        f'main_source_bytes={len(main_source)}',
        f'settings_source_bytes={len(settings_source)}',
        f'main_signed_bytes={len(main_signed)}',
        f'settings_signed_bytes={len(settings_signed)}',
        f'main_source_sha256={hashlib.sha256(main_source).hexdigest()}',
        f'settings_source_sha256={hashlib.sha256(settings_source).hexdigest()}',
        f'main_signed_sha256={hashlib.sha256(main_signed).hexdigest()}',
        f'settings_signed_sha256={hashlib.sha256(settings_signed).hexdigest()}',
        f'main_prefix={main_signed[:4]!r}',
        f'settings_prefix={settings_signed[:4]!r}',
        f'alarm_get_count={main_ids["com.apple.mobiletimer-framework.MobileTimerIntents.MTGetAlarmsIntent"]}',
        f'alarm_delete_count={main_ids["com.apple.clock.DeleteAlarmIntent"]}',
        f'alarm_create_count={main_ids["com.apple.mobiletimer-framework.MobileTimerIntents.MTCreateAlarmIntent"]}',
        f'reminder_find_count={main_ids["is.workflow.actions.filter.reminders"]}',
        f'reminder_add_count={main_ids["is.workflow.actions.addnewreminder"]}',
        f'reminder_remove_count={main_ids["is.workflow.actions.removereminders"]}',
        f'main_interactive_menu_count={main_ids["is.workflow.actions.choosefromlist"]}',
        f'main_ask_count={main_ids["is.workflow.actions.ask"]}',
        f'prefix={PREFIX}',
    ])
except urllib.error.HTTPError as exc:
    body = exc.read()
    log.append(f'http_error={exc.code}')
    log.append(f'http_body={body[:1000]!r}')
    raise
except Exception as exc:
    log.append(f'exception={type(exc).__name__}: {exc}')
    log.append(traceback.format_exc())
    raise
finally:
    DIAG.write_text('\n'.join(log), encoding='utf-8')
    print('\n'.join(log), flush=True)
