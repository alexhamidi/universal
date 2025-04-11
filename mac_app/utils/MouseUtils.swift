import Cocoa
import Foundation

public class MouseUtils {
    static let shared = MouseUtils()

    private var cliclickPath: String {
        // Check both Intel and Apple Silicon paths
        let paths = [
            "/opt/homebrew/bin/cliclick",  // Apple Silicon
            "/usr/local/bin/cliclick"      // Intel
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
        print("Installing cliclick via Homebrew...")
        let process = Process()
        process.launchPath = "/opt/homebrew/bin/brew"  // Use full path to brew
        process.arguments = ["install", "cliclick"]

        do {
            try process.run()
            process.waitUntilExit()
        } catch {
            print("Failed to install cliclick: \(error)")
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
            print("Failed to install cliclick. Please install it manually with: brew install cliclick")
            return
        }

        let process = Process()
        process.launchPath = cliclickPath
        process.arguments = args

        do {
            try process.run()
            process.waitUntilExit()

            if process.terminationStatus != 0 {
                print("cliclick command failed with status: \(process.terminationStatus)")
            }
        } catch {
            print("Failed to execute cliclick: \(error)")
        }
    }

    func click(at point: CGPoint) {
        print("Clicking at: \(point)")
        executeCliclick(["c:\(Int(point.x)),\(Int(point.y))"])
    }

    func doubleClick(at point: CGPoint) {
        print("Double-clicking at: \(point)")
        executeCliclick(["dc:\(Int(point.x)),\(Int(point.y))"])
    }

    func rightClick(at point: CGPoint) {
        print("Right-clicking at: \(point)")
        executeCliclick(["rc:\(Int(point.x)),\(Int(point.y))"])
    }

    func moveMouse(to point: CGPoint) {
        print("Moving mouse to: \(point)")
        executeCliclick(["m:\(Int(point.x)),\(Int(point.y))"])
    }
}
