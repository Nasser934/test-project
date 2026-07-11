# إعداد Apple Developer

## App IDs

أنشئ IDs صريحة:

- `com.sukun.app`
- `com.sukun.app.activity-monitor`
- `com.sukun.app.shield-configuration`
- `com.sukun.app.shield-action`

فعّل Family Controls وApp Groups لكل ID، واربطها بالمجموعة `group.com.sukun.app`. اطلب entitlement للتوزيع من Apple قبل TestFlight/App Store؛ وجود entitlement في ملف المشروع وحده لا يمنح صلاحية التوقيع.

## التوقيع

- ضع `DEVELOPMENT_TEAM` في `project.yml`.
- شغّل `xcodegen generate`.
- افتح المشروع وتحقق من Signing & Capabilities في targets الأربعة.
- لا تغيّر extension point IDs؛ monitor يستخدم `com.apple.deviceactivity.monitor-extension`.

## اختبار الجهاز

1. ثبّت التطبيق على iPhone فعلي.
2. امنح Screen Time authorization.
3. اختر تطبيق اختبار غير أساسي.
4. شغّل الاختبار الفوري وتأكد من ظهور Shield.
5. أنشئ فترة تبدأ بعد دقيقتين وتنتهي بعد خمس دقائق.
6. أغلق التطبيق تمامًا.
7. تحقق من بدء Shield وانتهائه في الموعدين.
8. أعد التشغيل، غيّر المنطقة الزمنية، وكرر اختبار الاستعادة.

مراجع Apple: [Family Controls](https://developer.apple.com/documentation/familycontrols)، [Device Activity](https://developer.apple.com/documentation/deviceactivity)، [Managed Settings](https://developer.apple.com/documentation/managedsettings).
