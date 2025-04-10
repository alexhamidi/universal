// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "KeyLogger",
    platforms: [
        .macOS(.v12)
    ],
    dependencies: [
        .package(url: "https://github.com/MacPaw/OpenAI.git", revision: "4a3c5d20decb646ac0f0c91703b7aa61e15b7145")
    ],
    targets: [
        .executableTarget(
            name: "KeyLogger",
            dependencies: ["OpenAI"],
            path: "."
        )
    ]
)
