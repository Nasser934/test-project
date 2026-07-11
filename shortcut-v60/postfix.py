from pathlib import Path

# V6.1 uses a compact generic processor. Duration wiring is patched safely
# after compilation in inspect_sign.py.
for name in ('prayer-main-v60.cherri', 'prayer-settings-v60.cherri'):
    p = Path('shortcut-v60') / name
    text = p.read_text(encoding='utf-8')
    p.write_text(text, encoding='utf-8')
