import FamilyControls
import SukunCore
import SwiftUI

struct TodayView: View {
    @Environment(AppModel.self) private var model

    var body: some View {
        ZStack {
            SukunTheme.navy.ignoresSafeArea()
            VStack(spacing: 12) {
                header
                HStack(alignment: .top, spacing: 12) {
                    hero.frame(maxWidth: .infinity)
                    PrayerTimeline(prayerTimes: model.prayerTimes).frame(width: 135)
                }
                Spacer(minLength: 0)
            }
            .padding(.horizontal, 20)
            .padding(.top, 8)
        }
        .sheet(isPresented: Binding(get: { model.showingTestResult }, set: { model.showingTestResult = $0 })) {
            ProtectionTestResultView()
                .presentationDetents([.medium])
                .presentationDragIndicator(.visible)
        }
        .task { model.refreshPrayerTimes() }
    }

    private var header: some View {
        HStack(alignment: .top) {
            VStack(alignment: .trailing, spacing: 2) {
                Text("اليوم").font(.system(size: 28, weight: .bold))
                Text(Date.now.formatted(.dateTime.locale(Locale(identifier: "ar_SA")).weekday(.wide).day().month(.wide).year()))
                    .font(.footnote).foregroundStyle(SukunTheme.muted)
                Text(Date.now.formatted(.dateTime.locale(Locale(identifier: "ar_SA@calendar=islamic-umalqura")).day().month(.wide).year()))
                    .font(.caption).foregroundStyle(SukunTheme.muted)
            }
            Spacer()
            Label(model.cityName, systemImage: "location")
                .font(.caption)
                .padding(10)
                .background(SukunTheme.surface, in: RoundedRectangle(cornerRadius: 16))
                .overlay(RoundedRectangle(cornerRadius: 16).stroke(.white.opacity(0.12)))
        }
    }

    private var hero: some View {
        VStack(spacing: 14) {
            TimelineView(.periodic(from: .now, by: 1)) { context in
                VStack(spacing: 5) {
                    Text("الوقت المتبقي حتى").font(.caption).foregroundStyle(SukunTheme.muted)
                    Text("صلاة \(model.nextPrayer?.prayer.arabicName ?? "الظهر")")
                        .font(.system(size: 29, weight: .semibold)).foregroundStyle(SukunTheme.sand)
                    Text(countdown(to: model.nextPrayer?.date, now: context.date))
                        .font(.system(size: 38, weight: .bold, design: .rounded))
                        .monospacedDigit().foregroundStyle(SukunTheme.mint)
                    Text(model.nextPrayer?.date.formatted(date: .omitted, time: .shortened) ?? "—")
                        .font(.headline)
                    Text("موعد الصلاة").font(.caption).foregroundStyle(SukunTheme.muted)
                }
            }

            HStack(spacing: 10) {
                Image("ProtectionShield").resizable().scaledToFit().frame(width: 44, height: 50)
                VStack(alignment: .trailing, spacing: 4) {
                    Text(model.health.isReady ? "الحماية جاهزة" : "أكمل إعداد الحماية")
                        .font(.headline).foregroundStyle(SukunTheme.mint)
                    Text(model.health.isReady ? "ستتوقف التطبيقات المحددة عند حلول وقت الصلاة." : "امنح الصلاحية واختر التطبيقات مرة واحدة.")
                        .font(.caption2).foregroundStyle(.white.opacity(0.82))
                }
            }
            .padding(12)
            .frame(maxWidth: .infinity)
            .background(SukunTheme.surface, in: RoundedRectangle(cornerRadius: 18))
            .overlay(RoundedRectangle(cornerRadius: 18).stroke(.white.opacity(0.12)))

            Button { Task { await model.runProtectionTest() } } label: {
                HStack {
                    Image(systemName: model.isTesting ? "hourglass" : "shield")
                    Text(model.isTesting ? "جارٍ اختبار الحماية…" : "اختبار الحماية الآن")
                }
                .frame(maxWidth: .infinity, minHeight: 50)
            }
            .buttonStyle(.plain)
            .fontWeight(.bold)
            .foregroundStyle(SukunTheme.navy)
            .background(SukunTheme.mint, in: RoundedRectangle(cornerRadius: 16))
            .disabled(model.isTesting)

            VStack(alignment: .trailing, spacing: 8) {
                Text("القادمتان").font(.caption).foregroundStyle(SukunTheme.muted)
                VStack(spacing: 0) {
                    ForEach(Array(model.prayerTimes.filter { $0.prayer.isLockable && $0.date >= .now }.prefix(2))) { item in
                        HStack {
                            Text(item.date.formatted(date: .omitted, time: .shortened)).foregroundStyle(SukunTheme.muted)
                            Spacer()
                            Text(item.prayer.arabicName).fontWeight(.semibold)
                        }
                        .font(.subheadline).padding(.vertical, 10)
                        if item.id != model.prayerTimes.filter({ $0.prayer.isLockable && $0.date >= .now }).prefix(2).last?.id { Divider() }
                    }
                }
                .padding(.horizontal, 10)
                .background(SukunTheme.surface, in: RoundedRectangle(cornerRadius: 16))
                .overlay(RoundedRectangle(cornerRadius: 16).stroke(.white.opacity(0.12)))
            }
        }
        .padding(.top, 28)
    }

    private func countdown(to target: Date?, now: Date) -> String {
        let seconds = max(0, Int((target ?? now).timeIntervalSince(now)))
        return String(format: "%02d:%02d:%02d", seconds / 3600, (seconds % 3600) / 60, seconds % 60)
    }
}

struct PrayerTimeline: View {
    let prayerTimes: [PrayerTime]

    var body: some View {
        VStack(alignment: .trailing, spacing: 0) {
            ForEach(prayerTimes) { item in
                HStack(spacing: 8) {
                    VStack(alignment: .trailing, spacing: 1) {
                        Text(item.prayer.arabicName).font(.subheadline).fontWeight(.semibold)
                            .foregroundStyle(item.prayer == .dhuhr ? SukunTheme.sand : .white)
                        Text(item.date.formatted(date: .omitted, time: .shortened))
                            .font(.caption2).foregroundStyle(SukunTheme.muted)
                    }
                    ZStack {
                        Rectangle().fill(SukunTheme.muted.opacity(0.7)).frame(width: 2, height: 78)
                        Circle().stroke(item.prayer == .dhuhr ? SukunTheme.sand : SukunTheme.muted, lineWidth: 2)
                            .background(Circle().fill(SukunTheme.navy)).frame(width: 20, height: 20)
                        if item.prayer == .dhuhr { Image(systemName: "calendar").font(.caption2).foregroundStyle(SukunTheme.navy).padding(7).background(SukunTheme.sand, in: Circle()) }
                    }
                }
            }
        }
        .padding(.top, 18)
    }
}

struct ProtectionView: View {
    @Environment(AppModel.self) private var model

    var body: some View {
        @Bindable var model = model
        NavigationStack {
            List {
                Section("حالة النظام") {
                    HealthRow(title: "صلاحية مدة الاستخدام", ready: model.health.authorizationGranted)
                    HealthRow(title: "التطبيقات المختارة", ready: model.selectionCount > 0, detail: "\(model.selectionCount)")
                    HealthRow(title: "الفترات المجدولة", ready: model.health.scheduledWindows > 0, detail: "\(model.health.scheduledWindows)")
                }
                Section {
                    Button("منح الصلاحية واختيار التطبيقات") { Task { await model.requestAuthorizationAndPick() } }
                    Button("إعادة بناء جدول اليوم") { try? model.rebuildSchedule() }
                }
                Section("الحماية") {
                    Toggle("الحماية التلقائية", isOn: Binding(get: { model.preferences.automaticProtection }, set: { model.preferences.automaticProtection = $0; try? model.rebuildSchedule() }))
                    Stepper("المدة: \(model.preferences.durationMinutes) دقيقة", value: Binding(get: { model.preferences.durationMinutes }, set: { model.preferences.durationMinutes = $0; try? model.rebuildSchedule() }), in: 5...60, step: 5)
                }
            }
            .scrollContentBackground(.hidden).background(SukunTheme.navy)
            .navigationTitle("الحماية")
        }
    }
}

struct HealthRow: View {
    let title: String
    let ready: Bool
    var detail: String? = nil
    var body: some View {
        HStack { Image(systemName: ready ? "checkmark.circle.fill" : "exclamationmark.circle").foregroundStyle(ready ? SukunTheme.mint : SukunTheme.sand); Text(title); Spacer(); if let detail { Text(detail).foregroundStyle(.secondary) } }
    }
}

struct HistoryView: View {
    var body: some View {
        NavigationStack {
            ContentUnavailableView("لا توجد جلسات بعد", systemImage: "clock.arrow.circlepath", description: Text("ستظهر هنا جلسات الحماية التي بدأت وانتهت على هذا الجهاز."))
                .navigationTitle("السجل").background(SukunTheme.navy)
        }
    }
}

struct SettingsView: View {
    @Environment(AppModel.self) private var model
    var body: some View {
        NavigationStack {
            List {
                Section("المواقيت") {
                    LabeledContent("المدينة", value: model.cityName)
                    LabeledContent("طريقة الحساب", value: "أم القرى")
                    LabeledContent("المذهب", value: "الشافعي")
                }
                Section("الخصوصية") { Text("كل الحسابات والاختيارات تبقى على جهازك. لا حسابات، لا إعلانات، ولا تتبع.") }
            }
            .scrollContentBackground(.hidden).background(SukunTheme.navy)
            .navigationTitle("الإعدادات")
        }
    }
}

struct ProtectionTestResultView: View {
    @Environment(\.dismiss) private var dismiss
    var body: some View {
        VStack(spacing: 18) {
            Image("ProtectionShield").resizable().scaledToFit().frame(width: 88, height: 96)
            Text("الحماية تعمل").font(.title2).fontWeight(.bold)
            Text("نجحت الصلاحية والقفل الفوري. اختبر التشغيل المجدول مرة أخيرة على iPhone فعلي.")
                .multilineTextAlignment(.center).foregroundStyle(.secondary)
            Button("تم") { dismiss() }.buttonStyle(.borderedProminent).tint(SukunTheme.mint).foregroundStyle(SukunTheme.navy)
        }
        .padding(28)
    }
}
