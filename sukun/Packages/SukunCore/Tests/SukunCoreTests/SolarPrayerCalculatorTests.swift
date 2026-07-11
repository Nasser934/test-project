import XCTest
@testable import SukunCore

final class SolarPrayerCalculatorTests: XCTestCase {
    func testRiyadhPrayerOrderAndApproximateNoon() throws {
        let zone = try XCTUnwrap(TimeZone(identifier: "Asia/Riyadh"))
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = zone
        let date = try XCTUnwrap(calendar.date(from: DateComponents(year: 2026, month: 7, day: 11, hour: 8)))
        let values = SolarPrayerCalculator().calculate(
            on: date,
            coordinates: Coordinates(latitude: 24.7136, longitude: 46.6753),
            timeZone: zone
        )
        XCTAssertEqual(values.map(\.prayer), Prayer.allCases)
        XCTAssertEqual(values.map(\.date), values.map(\.date).sorted())
        let dhuhr = try XCTUnwrap(values.first { $0.prayer == .dhuhr })
        let components = calendar.dateComponents([.hour, .minute], from: dhuhr.date)
        XCTAssertEqual(components.hour, 12)
        XCTAssertLessThan(abs((components.minute ?? 0) - 1), 8)
    }

    func testSunriseIsNeverLockable() {
        XCTAssertFalse(Prayer.sunrise.isLockable)
        XCTAssertTrue(Prayer.fajr.isLockable)
    }
}
