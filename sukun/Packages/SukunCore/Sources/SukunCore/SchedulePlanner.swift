import Foundation

public struct SchedulePlanner: Sendable {
    public init() {}

    public func windows(
        from prayerTimes: [PrayerTime],
        preferences: ProtectionPreferences,
        now: Date = .now
    ) -> [ProtectionWindow] {
        guard preferences.automaticProtection else { return [] }
        return prayerTimes.compactMap { item in
            guard item.prayer.isLockable,
                  preferences.enabledPrayers.contains(item.prayer),
                  item.date >= now.addingTimeInterval(-60)
            else { return nil }
            return ProtectionWindow(
                prayer: item.prayer,
                start: item.date,
                end: item.date.addingTimeInterval(TimeInterval(preferences.durationMinutes * 60))
            )
        }
    }

    public func nextPrayer(in prayerTimes: [PrayerTime], after date: Date = .now) -> PrayerTime? {
        prayerTimes.filter { $0.date >= date && $0.prayer.isLockable }.min { $0.date < $1.date }
    }
}
