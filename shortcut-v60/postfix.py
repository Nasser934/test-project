from pathlib import Path

for name in ('prayer-main-v60.cherri', 'prayer-settings-v60.cherri'):
    p = Path('shortcut-v60') / name
    text = p.read_text(encoding='utf-8')
    p.write_text(text, encoding='utf-8')
