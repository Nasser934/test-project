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
s = s.replace('@tomorrow = adjustDate(@now, "Add", qty(1, "days"))', '@oneDay = qty(1, "days")\n@tomorrow = adjustDate(@now, "Add", @oneDay)')
s = s.replace('@targetTime = adjustDate(@targetTime, "Add", qty(@offset, "min"))', '@offsetDuration = qty(@offset, "min")\n            @targetTime = adjustDate(@targetTime, "Add", @offsetDuration)')
replacements = {
    '@method = getMatchGroup(@methodMatch, 1)': '@methodRaw = getMatchGroup(@methodMatch, 1)\n@method = getText(@methodRaw)',
    '@locationMode = getMatchGroup(@locationModeMatch, 1)': '@locationModeRaw = getMatchGroup(@locationModeMatch, 1)\n@locationMode = getText(@locationModeRaw)',
    '@latitude = getMatchGroup(@latMatch, 1)': '@latitudeRaw = getMatchGroup(@latMatch, 1)\n    @latitude = getText(@latitudeRaw)',
    '@longitude = getMatchGroup(@lonMatch, 1)': '@longitudeRaw = getMatchGroup(@lonMatch, 1)\n    @longitude = getText(@longitudeRaw)',
    '@cacheDate = getValue(@cacheData, "data.date.gregorian.date")': '@cacheDateRaw = getValue(@cacheData, "data.date.gregorian.date")\n        @cacheDate = getText(@cacheDateRaw)',
    '@weekday = getValue(@apiData, "data.date.gregorian.weekday.en")': '@weekdayRaw = getValue(@apiData, "data.date.gregorian.weekday.en")\n@weekday = getText(@weekdayRaw)',
    '@hijriMonth = getValue(@apiData, "data.date.hijri.month.number")': '@hijriMonthRaw = getValue(@apiData, "data.date.hijri.month.number")\n@hijriMonth = getText(@hijriMonthRaw)',
    '@successEnabled = getMatchGroup(@successMatch, 1)': '@successEnabledRaw = getMatchGroup(@successMatch, 1)\n@successEnabled = getText(@successEnabledRaw)',
}
for old, new in replacements.items():
    s = s.replace(old, new)
s = s.replace('''for line in @settingsLines {
    if @line contains "|" {''', '''for line in @settingsLines {
    @lineText = getText(@line)
    if @lineText contains "|" {''')
s = s.replace('@parts = splitText(@line, "|")', '@parts = splitText(@lineText, "|")')
s = s.replace('@key = getListItem(@parts, 1)', '@keyRaw = getListItem(@parts, 1)\n        @key = getText(@keyRaw)')
s = s.replace('@mode = getListItem(@parts, 2)', '@modeRaw = getListItem(@parts, 2)\n        @mode = getText(@modeRaw)')
s = s.replace('@offset = getListItem(@parts, 3)', '@offsetRaw = getListItem(@parts, 3)\n        @offset = getText(@offsetRaw)')
s = s.replace('@offset = getListItem(@parts, 4)', '@offsetRaw = getListItem(@parts, 4)\n                @offset = getText(@offsetRaw)')
s = s.replace('@qiyamSource = getListItem(@parts, 4)', '@qiyamSourceRaw = getListItem(@parts, 4)\n            @qiyamSource = getText(@qiyamSourceRaw)')
p.write_text(s, encoding='utf-8')

settings_final = Path('shortcut-v60/prayer-settings-v60.cherri').read_text(encoding='utf-8')
main_final = Path('shortcut-v60/prayer-main-v60.cherri').read_text(encoding='utf-8')
assert 'chooseFromList(list(' not in settings_final
assert '@methodName ==' not in settings_final
assert '@modeChoice ==' not in settings_final
assert 'adjustDate(@now, "Add", qty' not in main_final
assert 'getFile("PrayerAlarm/settings.txt", false)' not in main_final
