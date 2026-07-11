import ManagedSettings
import ManagedSettingsUI
import UIKit

final class ShieldConfigurationExtension: ShieldConfigurationDataSource {
    private var configuration: ShieldConfiguration {
        ShieldConfiguration(
            backgroundBlurStyle: .systemUltraThinMaterialDark,
            backgroundColor: UIColor(red: 0.02, green: 0.09, blue: 0.15, alpha: 1),
            icon: UIImage(named: "ProtectionShield"),
            title: .init(text: "حان وقت الصلاة", color: .white),
            subtitle: .init(text: "خذ لحظة هادئة للصلاة، ثم ستعود تطبيقاتك تلقائيًا.", color: UIColor(white: 0.82, alpha: 1)),
            primaryButtonLabel: .init(text: "إغلاق التطبيق", color: UIColor(red: 0.02, green: 0.09, blue: 0.15, alpha: 1)),
            primaryButtonBackgroundColor: UIColor(red: 0.35, green: 0.84, blue: 0.65, alpha: 1),
            secondaryButtonLabel: .init(text: "العودة إلى سُكون", color: .white)
        )
    }

    override func configuration(shielding application: Application) -> ShieldConfiguration { configuration }
    override func configuration(shielding application: Application, in category: ActivityCategory) -> ShieldConfiguration { configuration }
    override func configuration(shielding webDomain: WebDomain) -> ShieldConfiguration { configuration }
    override func configuration(shielding webDomain: WebDomain, in category: ActivityCategory) -> ShieldConfiguration { configuration }
}
