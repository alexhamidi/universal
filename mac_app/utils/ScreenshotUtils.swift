import Cocoa
import Foundation

public class ScreenshotUtils {
    static let shared = ScreenshotUtils()

    private let screenshotsDirectory = "screenshots"

    func setupScreenshotsDirectory() {
        let fileManager = FileManager.default
        let screenshotsPath = (fileManager.currentDirectoryPath as NSString).appendingPathComponent("\(screenshotsDirectory)")

        if !fileManager.fileExists(atPath: screenshotsPath) {
            do {
                try fileManager.createDirectory(atPath: screenshotsPath, withIntermediateDirectories: true)
                print("Created screenshots directory at: \(screenshotsPath)")
            } catch {
                print("Error creating screenshots directory: \(error)")
            }
        }
    }

    func captureScreenshot() -> String? {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd_HH-mm-ss"
        let timestamp = dateFormatter.string(from: Date())
        let filename = "screenshot_\(timestamp).png"
        let fileManager = FileManager.default
        let screenshotsPath = (fileManager.currentDirectoryPath as NSString).appendingPathComponent(screenshotsDirectory)
        let filepath = (screenshotsPath as NSString).appendingPathComponent(filename)

        // Get the main screen
        guard let screen = NSScreen.main else { return nil }

        // Create CGImage of the entire screen
        guard let screenshot = CGWindowListCreateImage(
            screen.frame,
            .optionOnScreenOnly,
            kCGNullWindowID,
            [.bestResolution]
        ) else { return nil }

        // Convert to NSImage
        let image = NSImage(cgImage: screenshot, size: screen.frame.size)

        // Convert to PNG data
        guard let tiffData = image.tiffRepresentation,
              let bitmapImage = NSBitmapImageRep(data: tiffData),
              let pngData = bitmapImage.representation(using: .png, properties: [:]) else {
            return nil
        }

        do {
            try pngData.write(to: URL(fileURLWithPath: filepath))
            print("Screenshot saved to: \(filepath)")
            return filepath
        } catch {
            print("Error saving screenshot: \(error)")
            return nil
        }
    }




}
