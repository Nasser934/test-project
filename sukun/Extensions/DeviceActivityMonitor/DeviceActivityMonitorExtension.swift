import DeviceActivity
import FamilyControls
import ManagedSettings
import SukunCore

final class DeviceActivityMonitorExtension: DeviceActivityMonitor {
    private let settings = ManagedSettingsStore(named: .sukun)
    private let shared = AppGroupStore()

    override func intervalDidStart(for activity: DeviceActivityName) {
        super.intervalDidStart(for: activity)
        let selection = shared.selection()
        settings.shield.applications = selection.applicationTokens.isEmpty ? nil : selection.applicationTokens
        settings.shield.applicationCategories = selection.categoryTokens.isEmpty ? nil : .specific(selection.categoryTokens)
        settings.shield.webDomains = selection.webDomainTokens.isEmpty ? nil : selection.webDomainTokens
        var health = shared.health()
        health.lastMonitorStart = .now
        health.lastError = nil
        shared.save(health: health)
    }

    override func intervalDidEnd(for activity: DeviceActivityName) {
        super.intervalDidEnd(for: activity)
        settings.clearAllSettings()
        var health = shared.health()
        health.lastMonitorEnd = .now
        shared.save(health: health)
    }
}
