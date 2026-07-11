import XCTest
@testable import SukunCore

final class SchedulePlannerTests: XCTestCase {
    func testPlannerSkipsSunriseAndDisabledPrayers() {
        let now = Date(timeIntervalSince1970: 1_000)
        let values = [
            PrayerTime(prayer: .sunrise, date: now.addingTimeInterval(100)),
            PrayerTime(prayer: .dhuhr, date: now.addingTimeInterval(200)),
            PrayerTime(prayer: .asr, date: now.addingTimeInterval(300))
        ]
        let preferences = ProtectionPreferences(enabledPrayers: [.dhuhr], durationMinutes: 25)
        let result = SchedulePlanner().windows(from: values, preferences: preferences, now: now)
        XCTAssertEqual(result.count, 1)
        XCTAssertEqual(result[0].prayer, .dhuhr)
        XCTAssertEqual(result[0].end.timeIntervalSince(result[0].start), 1_500, accuracy: 0.1)
    }
}
