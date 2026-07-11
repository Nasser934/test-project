// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "SukunCore",
    platforms: [.iOS(.v17), .macOS(.v13)],
    products: [.library(name: "SukunCore", targets: ["SukunCore"])],
    targets: [
        .target(name: "SukunCore"),
        .testTarget(name: "SukunCoreTests", dependencies: ["SukunCore"])
    ]
)
