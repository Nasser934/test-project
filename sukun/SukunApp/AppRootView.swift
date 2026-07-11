import FamilyControls
import SwiftUI

struct AppRootView: View {
    @Environment(AppModel.self) private var model

    var body: some View {
        @Bindable var model = model
        TabView {
            TodayView().tabItem { Label("اليوم", systemImage: "calendar") }
            ProtectionView().tabItem { Label("الحماية", systemImage: "checkmark.shield") }
            HistoryView().tabItem { Label("السجل", systemImage: "clock.arrow.circlepath") }
            SettingsView().tabItem { Label("الإعدادات", systemImage: "gearshape") }
        }
        .tint(SukunTheme.mint)
        .familyActivityPicker(isPresented: $model.showingPicker, selection: $model.selection)
        .onChange(of: model.showingPicker) { _, isShowing in if !isShowing { model.persistSelection() } }
        .alert("سُكون", isPresented: Binding(get: { model.errorMessage != nil }, set: { if !$0 { model.errorMessage = nil } })) {
            Button("حسنًا") { model.errorMessage = nil }
        } message: { Text(model.errorMessage ?? "") }
    }
}

enum SukunTheme {
    static let navy = Color(red: 0.02, green: 0.09, blue: 0.15)
    static let surface = Color(red: 0.05, green: 0.14, blue: 0.22)
    static let mint = Color(red: 0.35, green: 0.84, blue: 0.65)
    static let sand = Color(red: 0.94, green: 0.73, blue: 0.42)
    static let muted = Color(red: 0.58, green: 0.65, blue: 0.72)
}
