import CoreLocation
import FamilyControls
import Foundation
import Observation
import SukunCore

@MainActor @Observable
final class AppModel {
    var selection = FamilyActivitySelection()
    var prayerTimes: [PrayerTime] = []
    var preferences = ProtectionPreferences()
    var health = ProtectionHealth()
    var showingPicker = false
    var showingTestResult = false
    var isTesting = false
    var errorMessage: String?

    let coordinates = Coordinates(latitude: 24.7136, longitude: 46.6753)
    let cityName = "الرياض"

    private let calculator = SolarPrayerCalculator()
    private let planner = SchedulePlanner()
    private let shared = AppGroupStore()
    private let screenTime = ScreenTimeCoordinator()

    init() {
        selection = shared.selection()
        preferences = shared.preferences()
        health = shared.health()
        refreshPrayerTimes()
    }

    var nextPrayer: PrayerTime? { planner.nextPrayer(in: prayerTimes) }
    var selectionCount: Int { selection.applicationTokens.count + selection.categoryTokens.count + selection.webDomainTokens.count }

    func refreshPrayerTimes(now: Date = .now) {
        let zone = TimeZone(identifier: "Asia/Riyadh") ?? .current
        prayerTimes = calculator.calculate(on: now, coordinates: coordinates, timeZone: zone)
    }

    func requestAuthorizationAndPick() async {
        do {
            try await screenTime.requestAuthorization()
            health.authorizationGranted = screenTime.authorizationGranted()
            shared.save(health: health)
            showingPicker = true
        } catch {
            errorMessage = error.localizedDescription
            health.lastError = error.localizedDescription
            shared.save(health: health)
        }
    }

    func persistSelection() {
        do {
            try shared.save(selection: selection)
            health.hasSelection = selectionCount > 0
            try rebuildSchedule()
        } catch { errorMessage = error.localizedDescription }
    }

    func rebuildSchedule(now: Date = .now) throws {
        try shared.save(preferences: preferences)
        let windows = planner.windows(from: prayerTimes, preferences: preferences, now: now)
        try screenTime.schedule(windows: windows)
        health.authorizationGranted = screenTime.authorizationGranted()
        health.hasSelection = selectionCount > 0
        health.scheduledWindows = windows.count
        health.lastScheduleRefresh = now
        health.lastError = nil
        shared.save(health: health)
    }

    func runProtectionTest() async {
        guard selectionCount > 0 else {
            await requestAuthorizationAndPick()
            return
        }
        isTesting = true
        screenTime.applyPreviewShield(selection: selection)
        try? await Task.sleep(for: .seconds(1))
        screenTime.clearPreviewShield()
        isTesting = false
        showingTestResult = true
    }
}
