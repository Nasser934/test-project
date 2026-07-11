import Foundation
import FamilyControls
import ManagedSettings
import SukunCore

enum AppGroup {
    static let identifier = "group.com.sukun.app"
    static let selectionKey = "familyActivitySelection"
    static let preferencesKey = "protectionPreferences"
    static let healthKey = "protectionHealth"
}

extension ManagedSettingsStore.Name {
    static let sukun = Self("sukun")
}

struct AppGroupStore {
    private let defaults = UserDefaults(suiteName: AppGroup.identifier) ?? .standard
    private let encoder = JSONEncoder()
    private let decoder = JSONDecoder()

    func save(selection: FamilyActivitySelection) throws {
        defaults.set(try encoder.encode(selection), forKey: AppGroup.selectionKey)
    }

    func selection() -> FamilyActivitySelection {
        guard let data = defaults.data(forKey: AppGroup.selectionKey),
              let value = try? decoder.decode(FamilyActivitySelection.self, from: data)
        else { return FamilyActivitySelection() }
        return value
    }

    func save(preferences: ProtectionPreferences) throws {
        defaults.set(try encoder.encode(preferences), forKey: AppGroup.preferencesKey)
    }

    func preferences() -> ProtectionPreferences {
        guard let data = defaults.data(forKey: AppGroup.preferencesKey),
              let value = try? decoder.decode(ProtectionPreferences.self, from: data)
        else { return ProtectionPreferences() }
        return value
    }

    func save(health: ProtectionHealth) {
        defaults.set(try? encoder.encode(health), forKey: AppGroup.healthKey)
    }

    func health() -> ProtectionHealth {
        guard let data = defaults.data(forKey: AppGroup.healthKey),
              let value = try? decoder.decode(ProtectionHealth.self, from: data)
        else { return ProtectionHealth() }
        return value
    }
}
