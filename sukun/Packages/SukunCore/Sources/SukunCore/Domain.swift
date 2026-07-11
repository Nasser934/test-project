import Foundation

public enum Prayer: String, CaseIterable, Codable, Sendable, Identifiable {
    case fajr, sunrise, dhuhr, asr, maghrib, isha
    public var id: String { rawValue }

    public var arabicName: String {
        switch self {
        case .fajr: "الفجر"
        case .sunrise: "الشروق"
        case .dhuhr: "الظهر"
        case .asr: "العصر"
        case .maghrib: "المغرب"
        case .isha: "العشاء"
        }
    }

    public var isLockable: Bool { self != .sunrise }
}

public struct Coordinates: Codable, Hashable, Sendable {
    public let latitude: Double
    public let longitude: Double

    public init(latitude: Double, longitude: Double) {
        self.latitude = latitude
        self.longitude = longitude
    }
}

public enum Madhab: String, Codable, CaseIterable, Sendable {
    case shafi, hanafi
    var shadowFactor: Double { self == .hanafi ? 2 : 1 }
}

public struct CalculationParameters: Codable, Hashable, Sendable {
    public var fajrAngle: Double
    public var ishaAngle: Double?
    public var ishaInterval: Int?
    public var madhab: Madhab

    public init(fajrAngle: Double, ishaAngle: Double? = nil, ishaInterval: Int? = nil, madhab: Madhab = .shafi) {
        self.fajrAngle = fajrAngle
        self.ishaAngle = ishaAngle
        self.ishaInterval = ishaInterval
        self.madhab = madhab
    }

    public static let ummAlQura = CalculationParameters(fajrAngle: 18.5, ishaInterval: 90)
}

public struct PrayerTime: Identifiable, Codable, Hashable, Sendable {
    public let prayer: Prayer
    public let date: Date
    public var id: Prayer { prayer }

    public init(prayer: Prayer, date: Date) {
        self.prayer = prayer
        self.date = date
    }
}

public struct ProtectionWindow: Identifiable, Codable, Hashable, Sendable {
    public let prayer: Prayer
    public let start: Date
    public let end: Date
    public var id: String { "\(prayer.rawValue)-\(start.timeIntervalSince1970)" }

    public init(prayer: Prayer, start: Date, end: Date) {
        self.prayer = prayer
        self.start = start
        self.end = end
    }
}

public struct ProtectionPreferences: Codable, Hashable, Sendable {
    public var enabledPrayers: Set<Prayer>
    public var durationMinutes: Int
    public var automaticProtection: Bool

    public init(enabledPrayers: Set<Prayer> = Set(Prayer.allCases.filter(\.isLockable)), durationMinutes: Int = 20, automaticProtection: Bool = true) {
        self.enabledPrayers = enabledPrayers
        self.durationMinutes = durationMinutes
        self.automaticProtection = automaticProtection
    }
}

public struct ProtectionHealth: Codable, Hashable, Sendable {
    public var authorizationGranted: Bool
    public var hasSelection: Bool
    public var scheduledWindows: Int
    public var lastScheduleRefresh: Date?
    public var lastMonitorStart: Date?
    public var lastMonitorEnd: Date?
    public var lastError: String?

    public init(
        authorizationGranted: Bool = false,
        hasSelection: Bool = false,
        scheduledWindows: Int = 0,
        lastScheduleRefresh: Date? = nil,
        lastMonitorStart: Date? = nil,
        lastMonitorEnd: Date? = nil,
        lastError: String? = nil
    ) {
        self.authorizationGranted = authorizationGranted
        self.hasSelection = hasSelection
        self.scheduledWindows = scheduledWindows
        self.lastScheduleRefresh = lastScheduleRefresh
        self.lastMonitorStart = lastMonitorStart
        self.lastMonitorEnd = lastMonitorEnd
        self.lastError = lastError
    }

    public var isReady: Bool { authorizationGranted && hasSelection && scheduledWindows > 0 && lastError == nil }
}
