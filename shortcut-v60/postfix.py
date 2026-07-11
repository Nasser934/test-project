from pathlib import Path

p = Path('shortcut-v60/prayer-main-v60.cherri')
s = p.read_text(encoding='utf-8')
s = s.replace(
    '@targetTime = date(@baseTime)',
    '@baseTimeText = getText(@baseTime)\n                @targetTime = date(@baseTimeText)'
)
p.write_text(s, encoding='utf-8')

p = Path('shortcut-v60/prayer-settings-v60.cherri')
s = p.read_text(encoding='utf-8')
p.write_text(s, encoding='utf-8')
