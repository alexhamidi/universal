import Cocoa
import Foundation

public class MouseUtils {
    static let shared = MouseUtils()

    private static func timestampedMessage(_ message: String) -> String {
        let date = Date()
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm:ss.SSS"
        return "[\(formatter.string(from: date))] \(message)"
    }

    private var cliclickPath: String {
        // Check both Intel and Apple Silicon paths
        let paths = [
            "/opt/homebrew/bin/cliclick",  // Apple Silicon
        ]
        return paths.first { FileManager.default.fileExists(atPath: $0) } ?? "/opt/homebrew/bin/cliclick"
    }

    private func checkCliclickInstalled() -> Bool {
        let process = Process()
        process.launchPath = "/usr/bin/which"
        process.arguments = ["cliclick"]

        let pipe = Pipe()
        process.standardOutput = pipe

        do {
            try process.run()
            process.waitUntilExit()
            return process.terminationStatus == 0
        } catch {
            return false
        }
    }

    private func installCliclick() {
        print(MouseUtils.timestampedMessage("Installing cliclick via Homebrew..."))
        let process = Process()
        process.launchPath = "/opt/homebrew/bin/brew"  // Use full path to brew
        process.arguments = ["install", "cliclick"]

        do {
            try process.run()
            process.waitUntilExit()
        } catch {
            print(MouseUtils.timestampedMessage("Failed to install cliclick: \(error)"))
        }
    }

    private func ensureCliclickAvailable() -> Bool {
        if !checkCliclickInstalled() {
            installCliclick()
            return checkCliclickInstalled()
        }
        return true
    }

    private func executeCliclick(_ args: [String]) {
        guard ensureCliclickAvailable() else {
            print(MouseUtils.timestampedMessage("Failed to install cliclick. Please install it manually with: brew install cliclick"))
            return
        }

        let process = Process()
        process.launchPath = cliclickPath
        process.arguments = args

        do {
            try process.run()
            process.waitUntilExit()

            if process.terminationStatus != 0 {
                print(MouseUtils.timestampedMessage("cliclick command failed with status: \(process.terminationStatus)"))
            }
        } catch {
            print(MouseUtils.timestampedMessage("Failed to execute cliclick: \(error)"))
        }
    }

    func click(at point: CGPoint) {
        print(MouseUtils.timestampedMessage("Clicking at: \(point)"))
        executeCliclick(["c:\(Int(point.x)),\(Int(point.y))"])
    }

    func doubleClick(at point: CGPoint) {
        print(MouseUtils.timestampedMessage("Double-clicking at: \(point)"))
        executeCliclick(["dc:\(Int(point.x)),\(Int(point.y))"])
    }

    func rightClick(at point: CGPoint) {
        print(MouseUtils.timestampedMessage("Right-clicking at: \(point)"))
        executeCliclick(["rc:\(Int(point.x)),\(Int(point.y))"])
    }

    func moveMouse(to point: CGPoint) {
        print(MouseUtils.timestampedMessage("Moving mouse to: \(point)"))
        executeCliclick(["m:\(Int(point.x)),\(Int(point.y))"])
    }
}
