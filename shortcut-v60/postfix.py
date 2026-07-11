from pathlib import Path

p = Path('shortcut-v60/prayer-main-v60.cherri')
s = p.read_text(encoding='utf-8')
p.write_text(s, encoding='utf-8')
