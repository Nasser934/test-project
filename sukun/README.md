# سُكون — Sukun

سُكون هو تطبيق iOS عربي، محلي بالكامل، يوقف التطبيقات التي يختارها المستخدم تلقائيًا عند دخول وقت الصلاة ثم يعيدها بعد انتهاء المدة. لا حسابات، لا إعلانات، لا تحليلات، ولا خادم خلفي.

## ما تم بناؤه

- واجهة SwiftUI عربية RTL مستندة إلى التصميم المختار: شاشة اليوم، خط المواقيت، العدّ التنازلي، حالة الحماية، الاختبار، الحماية، السجل، والإعدادات.
- حاسبة مواقيت فلكية offline بإعداد أم القرى، مع دعم المذهب الشافعي/الحنفي وفترة عشاء رمضان.
- اختيار التطبيقات عبر `FamilyActivityPicker` وتخزين الرموز داخل App Group.
- جدولة فترات الصلاة عبر `DeviceActivityCenter`.
- تطبيق القيود عبر `ManagedSettingsStore` من Device Activity Monitor extension.
- Shield Configuration وShield Action extensions بواجهة عربية.
- نواة `SukunCore` مستقلة وقابلة للاختبار، Privacy Manifest، XcodeGen، وCI.

## تشغيل المشروع

المتطلبات: macOS، Xcode 16.4 أو أحدث، و[XcodeGen](https://github.com/yonaskolb/XcodeGen).

```bash
brew install xcodegen
xcodegen generate
open Sukun.xcodeproj
```

قبل التشغيل على جهاز:

1. ضع Team ID الخاص بك في `project.yml` أو اختر الفريق في Xcode.
2. أنشئ App IDs الأربعة المذكورة في `docs/APPLE_SETUP.md`.
3. فعّل App Group `group.com.sukun.app` وFamily Controls لكل target.
4. اطلب Family Controls distribution entitlement من Apple.
5. شغّل على iPhone فعلي؛ امتدادات Screen Time لا يمكن اعتمادها من معاينة SwiftUI وحدها.

## التحقق

```bash
./scripts/verify.sh
```

راجع `docs/PRODUCT_SPEC.md`، `docs/ARCHITECTURE.md`، و`docs/RELEASE_CHECKLIST.md` قبل TestFlight.

## حدود المنصة

التطبيق لا يقفل الهاتف نفسه ولا يتجاوز حماية iOS. هو يطبّق Shield على التطبيقات/الفئات/المواقع التي وافق المستخدم على اختيارها، ضمن حدود Screen Time API وسياسات Apple.

## الترخيص

MIT — راجع `LICENSE`.
