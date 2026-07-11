from pathlib import Path

p = Path('shortcut-v60/prayer-main-v60.cherri')
s = p.read_text(encoding='utf-8')
s = s.replace(
    '    saveFile("PrayerAlarm/state.txt", "failures={@failureCount}\\nlast_failure={@todayText}", true)',
    '    @failureStateText = "failures={@failureCount}\\nlast_failure={@todayText}"\n    saveFile("PrayerAlarm/state.txt", @failureStateText, true)'
)
s = s.replace(
    '''saveFile(
    "PrayerAlarm/state.txt",
    "failures=0\\nlast_success={@todayText}\\ncreated={@createdCount}\\nused_cache={@usedCache}",
    true
)''',
    '''@successStateText = "failures=0\\nlast_success={@todayText}\\ncreated={@createdCount}\\nused_cache={@usedCache}"
saveFile(
    "PrayerAlarm/state.txt",
    @successStateText,
    true
)'''
)
p.write_text(s, encoding='utf-8')
assert 'saveFile("PrayerAlarm/state.txt", "' not in s
