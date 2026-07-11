from pathlib import Path

# Settings shortcut: make the user choose intentionally instead of preselecting all 14 items.
p = Path('shortcut-v60/prayer-settings-v60.cherri')
s = p.read_text(encoding='utf-8')
s = s.replace(
    '''@selected = chooseFromList(
    @eventNames,
    "اختر الصلوات والأوقات التي تريدها. يمكنك اختيار أي عدد.",
    true,
    true
)''',
    '''@selected = chooseFromList(
    @eventNames,
    "اختر الصلوات والأوقات التي تريدها. يمكنك اختيار أي عدد.",
    true,
    false
)'''
)
p.write_text(s, encoding='utf-8')

# Main shortcut fixes.
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
s = s.replace(
    '@offsetDuration = qty(@offset, "min")',
    '@offsetNumber = getNumbers(@offset)\n            @offsetDuration = qty(@offsetNumber, "min")'
)
p.write_text(s, encoding='utf-8')
assert 'saveFile("PrayerAlarm/state.txt", "' not in s
assert 'qty(@offset, "min")' not in s
