from pathlib import Path
import re

# Settings shortcut
p = Path('shortcut-v60/prayer-settings-v60.cherri')
s = p.read_text(encoding='utf-8')
s = re.sub(r"comment\('''.*?'''\)\s*", "", s, flags=re.S)
s = s.replace('@lines = []', '@modeOptions = list("إشعار فقط", "منبه الساعة + إشعار")\n@lines = []')
s = s.replace('chooseFromList(list("إشعار فقط", "منبه الساعة + إشعار"),', 'chooseFromList(@modeOptions,')
s = s.replace('''@methodName = chooseFromList(
    list("أم القرى — مناسب للمملكة", "رابطة العالم الإسلامي", "الهيئة المصرية", "جامعة كراتشي"),
    "اختر طريقة حساب مواقيت الصلاة"
)''', '''@methodOptions = list("أم القرى — مناسب للمملكة", "رابطة العالم الإسلامي", "الهيئة المصرية", "جامعة كراتشي")
@methodName = chooseFromList(
    @methodOptions,
    "اختر طريقة حساب مواقيت الصلاة"
)''')
s = s.replace('''@locationChoice = chooseFromList(
    list("موقعي الحالي يوميًا — مناسب للسفر", "مدينة ثابتة"),
    "كيف تريد تحديد الموقع؟"
)''', '''@locationOptions = list("موقعي الحالي يوميًا — مناسب للسفر", "مدينة ثابتة")
@locationChoice = chooseFromList(
    @locationOptions,
    "كيف تريد تحديد الموقع؟"
)''')
s = s.replace('''@successChoice = chooseFromList(
    list("تشغيل إشعار نجاح التحديث", "إيقاف إشعار النجاح"),
    "هل تريد إشعارًا بعد نجاح التحديث اليومي؟"
)''', '''@successOptions = list("تشغيل إشعار نجاح التحديث", "إيقاف إشعار النجاح")
@successChoice = chooseFromList(
    @successOptions,
    "هل تريد إشعارًا بعد نجاح التحديث اليومي؟"
)''')
s = s.replace('''    @qiyamChoice = chooseFromList(
        list("قبل الفجر — الافتراضي نصف ساعة", "بداية الثلث الأخير من الليل من API"),
        "اختر طريقة وقت قيام الليل"
    )''', '''    @qiyamOptions = list("قبل الفجر — الافتراضي نصف ساعة", "بداية الثلث الأخير من الليل من API")
    @qiyamChoice = chooseFromList(
        @qiyamOptions,
        "اختر طريقة وقت قيام الليل"
    )''')
s = s.replace('''@selected = chooseFromList(
    @eventNames,
    "اختر الصلوات والأوقات التي تريدها. يمكنك اختيار أي عدد.",
    true,
    true
)''', '''@selected = chooseFromList(
    @eventNames,
    "اختر الصلوات والأوقات التي تريدها. يمكنك اختيار أي عدد.",
    true,
    true
)
@selectedText = getText(@selected)''')
s = s.replace('@selected contains', '@selectedText contains')
s = s.replace('if !@selected {', 'if !@selectedText {')
s = s.replace(')\n@method = 4', ')\n@methodNameText = getText(@methodName)\n@method = 4', 1)
s = s.replace('@methodName ==', '@methodNameText ==')
s = s.replace('method_name={@methodName}', 'method_name={@methodNameText}')
s = s.replace(')\n@locationMode = "current"', ')\n@locationChoiceText = getText(@locationChoice)\n@locationMode = "current"', 1)
s = s.replace('@locationChoice ==', '@locationChoiceText ==')
s = s.replace(')\n@successNotification = 1', ')\n@successChoiceText = getText(@successChoice)\n@successNotification = 1', 1)
s = s.replace('@successChoice ==', '@successChoiceText ==')
s = s.replace('''    if @qiyamChoice == "بداية الثلث الأخير من الليل من API"''', '''    @qiyamChoiceText = getText(@qiyamChoice)
    if @qiyamChoiceText == "بداية الثلث الأخير من الليل من API"''')
s = re.sub(r'(\s*@modeChoice = chooseFromList\(@modeOptions,[^\n]+\)\n)(\s*)@mode =', r'\1\2@modeChoiceText = getText(@modeChoice)\n\2@mode =', s)
s = s.replace('@modeChoice ==', '@modeChoiceText ==')
s = s.replace('@fixedCity = askValue(', '@fixedCityInput = askValue(')
s = s.replace('    @fixedLocation = location(@fixedCity)', '    @fixedCity = getText(@fixedCityInput)\n    @fixedLocation = location(@fixedCity)')
p.write_text(s, encoding='utf-8')

# Main shortcut
p = Path('shortcut-v60/prayer-main-v60.cherri')
s = p.read_text(encoding='utf-8')
s = re.sub(r"comment\('''.*?'''\)\s*", "", s, flags=re.S)
s = re.sub(r'getFile\(("PrayerAlarm/[^\"]+"), false\)', r'getFile(\1, nil, false)', s)
p.write_text(s, encoding='utf-8')

settings_final = Path('shortcut-v60/prayer-settings-v60.cherri').read_text(encoding='utf-8')
main_final = Path('shortcut-v60/prayer-main-v60.cherri').read_text(encoding='utf-8')
assert 'chooseFromList(list(' not in settings_final
assert '@methodName ==' not in settings_final
assert '@modeChoice ==' not in settings_final
assert 'getFile("PrayerAlarm/settings.txt", false)' not in main_final
