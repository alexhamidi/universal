// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "KeyLogger",
    defaultLocalization: "en",
    platforms: [
        .macOS(.v12)
    ],
    dependencies: [
        .package(url: "https://github.com/MacPaw/OpenAI.git", from: "0.2.5")
    ],
    targets: [
        .executableTarget(
            name: "KeyLogger",
            dependencies: ["OpenAI"],
            path: ".",
            exclude: ["dist", "node_modules", "KeyLogger.app"]
        )
    ]
)
