@preconcurrency import DeviceActivity
@preconcurrency import FamilyControls
import Foundation
@preconcurrency import ManagedSettings
import SukunCore

@MainActor
final class ScreenTimeCoordinator {
    private let authorization = AuthorizationCenter.shared
    private let activityCenter = DeviceActivityCenter()
    private let shieldStore = ManagedSettingsStore(named: .init("sukun.preview"))
    private let shared = AppGroupStore()

    func requestAuthorization() async throws {
        try await authorization.requestAuthorization(for: .individual)
    }

    func applyPreviewShield(selection: FamilyActivitySelection) {
        shieldStore.shield.applications = selection.applicationTokens.isEmpty ? nil : selection.applicationTokens
        shieldStore.shield.applicationCategories = selection.categoryTokens.isEmpty ? nil : .specific(selection.categoryTokens)
        shieldStore.shield.webDomains = selection.webDomainTokens.isEmpty ? nil : selection.webDomainTokens
    }

    func clearPreviewShield() { shieldStore.clearAllSettings() }

    func schedule(windows: [ProtectionWindow]) throws {
        activityCenter.stopMonitoring()
        for window in windows.prefix(20) {
            let name = DeviceActivityName("sukun.\(window.prayer.rawValue).\(Int(window.start.timeIntervalSince1970))")
            let schedule = DeviceActivitySchedule(
                intervalStart: Calendar.current.dateComponents([.hour, .minute], from: window.start),
                intervalEnd: Calendar.current.dateComponents([.hour, .minute], from: window.end),
                repeats: false,
                warningTime: DateComponents(minute: 1)
            )
            try activityCenter.startMonitoring(name, during: schedule)
        }
    }

    func authorizationGranted() -> Bool { authorization.authorizationStatus == .approved }
}
