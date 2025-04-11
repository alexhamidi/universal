// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "KeyLogger",
    platforms: [
        .macOS(.v13)
    ],
    dependencies: [
        .package(url: "https://github.com/MacPaw/OpenAI.git", exact: "0.3.6"),
        .package(url: "https://github.com/soffes/HotKey.git", branch: "main"),
        .package(url: "https://github.com/sindresorhus/LaunchAtLogin.git", exact: "5.0.2"),
        .package(url: "https://github.com/krzysztofzablocki/Inject.git", branch: "main")
    ],
    targets: [
        .executableTarget(
            name: "KeyLogger",
            dependencies: [
                "OpenAI",
                "HotKey",
                "LaunchAtLogin",
                "Inject"
            ],
            path: ".",
            swiftSettings: [
                .unsafeFlags(["-enable-bare-slash-regex"])
            ]
        )
    ]
)
