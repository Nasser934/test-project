import Foundation

public struct SolarPrayerCalculator: Sendable {
    public init() {}

    public func calculate(
        on date: Date,
        coordinates: Coordinates,
        timeZone: TimeZone,
        parameters: CalculationParameters = .ummAlQura,
        calendar: Calendar = Calendar(identifier: .gregorian)
    ) -> [PrayerTime] {
        var localCalendar = calendar
        localCalendar.timeZone = timeZone
        let start = localCalendar.startOfDay(for: date)
        let day = localCalendar.ordinality(of: .day, in: .year, for: start) ?? 1
        let gamma = 2 * Double.pi / 365 * (Double(day) - 1)
        let equation = 229.18 * (0.000075 + 0.001868 * cos(gamma) - 0.032077 * sin(gamma) - 0.014615 * cos(2 * gamma) - 0.040849 * sin(2 * gamma))
        let declination = 0.006918 - 0.399912 * cos(gamma) + 0.070257 * sin(gamma) - 0.006758 * cos(2 * gamma) + 0.000907 * sin(2 * gamma) - 0.002697 * cos(3 * gamma) + 0.00148 * sin(3 * gamma)
        let offset = Double(timeZone.secondsFromGMT(for: start)) / 60
        let noon = 720 - (4 * coordinates.longitude) - equation + offset
        let latitude = radians(coordinates.latitude)

        func hourAngle(zenith: Double) -> Double {
            let z = radians(zenith)
            let numerator = cos(z) - sin(latitude) * sin(declination)
            let denominator = cos(latitude) * cos(declination)
            return degrees(acos(clamp(numerator / denominator))) * 4
        }

        let sunriseDelta = hourAngle(zenith: 90.833)
        let fajrDelta = hourAngle(zenith: 90 + parameters.fajrAngle)
        let shadowAltitude = atan(1 / (parameters.madhab.shadowFactor + tan(abs(latitude - declination))))
        let asrDelta = hourAngle(zenith: 90 - degrees(shadowAltitude))

        let sunrise = dateAt(minutes: noon - sunriseDelta, start: start, calendar: localCalendar)
        let sunset = dateAt(minutes: noon + sunriseDelta, start: start, calendar: localCalendar)
        let isRamadan = Calendar(identifier: .islamicUmmAlQura).component(.month, from: start) == 9
        let isha: Date
        if let angle = parameters.ishaAngle {
            isha = dateAt(minutes: noon + hourAngle(zenith: 90 + angle), start: start, calendar: localCalendar)
        } else {
            let base = parameters.ishaInterval ?? 90
            isha = localCalendar.date(byAdding: .minute, value: isRamadan && base == 90 ? 120 : base, to: sunset) ?? sunset
        }

        return [
            PrayerTime(prayer: .fajr, date: dateAt(minutes: noon - fajrDelta, start: start, calendar: localCalendar)),
            PrayerTime(prayer: .sunrise, date: sunrise),
            PrayerTime(prayer: .dhuhr, date: dateAt(minutes: noon + 2, start: start, calendar: localCalendar)),
            PrayerTime(prayer: .asr, date: dateAt(minutes: noon + asrDelta, start: start, calendar: localCalendar)),
            PrayerTime(prayer: .maghrib, date: sunset),
            PrayerTime(prayer: .isha, date: isha)
        ]
    }

    private func dateAt(minutes: Double, start: Date, calendar: Calendar) -> Date {
        calendar.date(byAdding: .second, value: Int((minutes * 60).rounded()), to: start) ?? start
    }

    private func radians(_ degrees: Double) -> Double { degrees * .pi / 180 }
    private func degrees(_ radians: Double) -> Double { radians * 180 / .pi }
    private func clamp(_ value: Double) -> Double { min(1, max(-1, value)) }
}
