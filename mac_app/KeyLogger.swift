// Main app for keylogger

import Cocoa
import Carbon
import Foundation


// Styling for the window itself

class FloatingWindow: NSWindow {
    private static var currentWindow: FloatingWindow?
    let textField: NSTextField

    static func createWindow() -> FloatingWindow {
        if let existing = currentWindow {
            existing.orderOut(nil)
            currentWindow = nil
        }
        let window = FloatingWindow()
        currentWindow = window
        return window
    }

    init() {
        let screenHeight = NSScreen.main?.frame.height ?? 800
        let windowHeight: CGFloat = 110
        let yPosition = screenHeight - windowHeight - 20  // 20px from top

        // Initialize the text field before super.init
        textField = NSTextField(frame: NSRect(x: 10, y: 10, width: 285, height: 85 ))
        textField.isEditable = false
        textField.isBordered = false
        textField.drawsBackground = false
        textField.textColor = .white
        textField.backgroundColor = .clear
        textField.font = NSFont.monospacedSystemFont(ofSize: 14, weight: .medium)
        textField.identifier = NSUserInterfaceItemIdentifier("displayText")
        textField.alignment = .left
        textField.stringValue = ""

        super.init(
            contentRect: NSRect(x: 20, y: yPosition, width: 305, height: windowHeight),
            styleMask: [.borderless],
            backing: .buffered,
            defer: false
        )

        // Configure window properties
        self.level = .statusBar
        self.backgroundColor = NSColor.systemGray.withAlphaComponent(0.9)
        self.isOpaque = false
        self.hasShadow = true
        self.isMovableByWindowBackground = false
        self.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary, .stationary]
        self.ignoresMouseEvents = true

        // Add the text field to the window
        self.contentView?.addSubview(textField)
    }

    override var canBecomeKey: Bool {
        return false
    }

    override var canBecomeMain: Bool {
        return false
    }
}




// Log object - most important f
class KeyLogger: NSObject {
    private var eventTap: CFMachPort?
    private var floatingWindow: FloatingWindow?
    private let maxDisplayedChars = 1000
    private let lineLength: Int = 32
    private let numLines: Int = 5
    private let screenshotsDirectory = "screenshots"

    private var isWindowVisible = false
    private var fullBuffer: [String] = []
    // private var lastKeystrokes: [String] = [] // this is the buffer, most important
    private var isCommandKeyPressed = false
    private var isOptionKeyPressed = false

    // starts to initialize the window
    override init() {
        super.init()
        print("KeyLogger initializing...")
        floatingWindow = FloatingWindow.createWindow()
        setupScreenshotsDirectory()
        updateWindowText()  // Add initial cursor
    }

    private func setupScreenshotsDirectory() {
        let fileManager = FileManager.default
        let screenshotsPath = (fileManager.currentDirectoryPath as NSString).appendingPathComponent(screenshotsDirectory)

        if !fileManager.fileExists(atPath: screenshotsPath) {
            do {
                try fileManager.createDirectory(atPath: screenshotsPath, withIntermediateDirectories: true)
                print("Created screenshots directory at: \(screenshotsPath)")
            } catch {
                print("Error creating screenshots directory: \(error)")
            }
        }
    }

    private func captureScreenshot() -> String? {
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

    // not important
    private func checkInputMonitoringPermission() -> Bool {
        let trusted = CGPreflightListenEventAccess()
        if !trusted {
            print("Requesting input monitoring permission...")
            let success = CGRequestListenEventAccess()
            return success
        }
        return trusted
    }

    // toggle
    private func toggleWindowVisibility() {
        isWindowVisible.toggle()

        if isWindowVisible {
            if floatingWindow == nil {
                floatingWindow = FloatingWindow.createWindow()
            }
            updateWindowText()  // Ensure cursor is displayed when window becomes visible
            floatingWindow?.makeKeyAndOrderFront(nil)
        } else {
            floatingWindow?.orderOut(nil)
        }
    }

    private func handleSubmit() {
        let currentText = fullBuffer.joined()
        if currentText.isEmpty {
            return
        }
        Task {
            do {
                guard let screenshotPath = captureScreenshot() else {
                    print("Failed to capture screenshot")
                    return
                }
                print("Captured screenshot at: \(screenshotPath)")
                _ = try await OpenAIService.shared.submitPrompt(currentText, screenshotPath)
                fullBuffer.removeAll()
                updateWindowText()
            } catch {
                print("Error submitting prompt: \(error)")
            }
        }
    }

    // this isnt really important
    func startLogging() {
        print("Starting keyboard logging...")

        guard checkInputMonitoringPermission() else {
            print("Failed to get input monitoring permission")
            return
        }

        guard let tap = CGEvent.tapCreate(
            tap: .cgSessionEventTap,
            place: .headInsertEventTap,
            options: .defaultTap,
            eventsOfInterest: CGEventMask((1 << CGEventType.keyDown.rawValue) | (1 << CGEventType.flagsChanged.rawValue)),
            callback: callback,
            userInfo: Unmanaged.passUnretained(self).toOpaque()
        ) else {
            print("Failed to create event tap")
            floatingWindow?.textField.stringValue = "Failed to create event tap"
            return
        }

        eventTap = tap
        let runLoopSource = CFMachPortCreateRunLoopSource(kCFAllocatorDefault, tap, 0)
        CFRunLoopAddSource(CFRunLoopGetCurrent(), runLoopSource, .commonModes)
        CGEvent.tapEnable(tap: tap, enable: true)

        print("Keyboard monitoring started successfully")
    }



    // important
    let callback: CGEventTapCallBack = { proxy, type, event, refcon in
        let logger = Unmanaged<KeyLogger>.fromOpaque(refcon!).takeUnretainedValue()
        if type != .flagsChanged && type != .keyDown {
            return Unmanaged.passRetained(event)
        }

        if type == .flagsChanged {
            let flags = event.flags
            logger.isCommandKeyPressed = flags.contains(.maskCommand)
            logger.isOptionKeyPressed = flags.contains(.maskAlternate)

        } else {
            let keycode = event.getIntegerValueField(.keyboardEventKeycode)

            // Check for Command + ; (semicolon)
            if logger.isCommandKeyPressed && keycode == 41 { // 41 is the keycode for semicolon
                DispatchQueue.main.async {
                    logger.toggleWindowVisibility()
                }
                return nil
            }

            if !logger.isWindowVisible {
                return Unmanaged.passRetained(event)
            }
               // Check for Command + Enter (keycode 36)
            if logger.isCommandKeyPressed && keycode == 36 {
                print("Command + Enter pressed")
                DispatchQueue.main.async {
                    logger.handleSubmit()
                }
                return Unmanaged.passRetained(event)
            }


            // Handle backspace (keycode 51) with modifiers
            if keycode == 51 && !logger.fullBuffer.isEmpty {
                if logger.isCommandKeyPressed {
                    // Clear entire buffer
                    logger.fullBuffer.removeAll()
                } else if logger.isOptionKeyPressed {
                    // Delete the last word
                    var deletedChar = logger.fullBuffer.last ?? ""
                    // First remove trailing spaces
                    while !logger.fullBuffer.isEmpty && deletedChar.trimmingCharacters(in: .whitespaces).isEmpty {
                        logger.fullBuffer.removeLast()
                        deletedChar = logger.fullBuffer.last ?? ""
                    }
                    // Then remove the word
                    while !logger.fullBuffer.isEmpty && !deletedChar.trimmingCharacters(in: .whitespaces).isEmpty {
                        logger.fullBuffer.removeLast()
                        deletedChar = logger.fullBuffer.last ?? ""
                    }
                } else {
                    logger.fullBuffer.removeLast()
                }

                logger.updateWindowText()
                return nil // Consume the backspace event
            }

            var actualStringLength: Int = 0
            var unicodeString = [UniChar](repeating: 0, count: 4)

            event.keyboardGetUnicodeString(
                maxStringLength: 4,
                actualStringLength: &actualStringLength,
                unicodeString: &unicodeString
            )

            if actualStringLength > 0 && !logger.isCommandKeyPressed  {
                let chars = String(utf16CodeUnits: unicodeString, count: actualStringLength)
                logger.fullBuffer.append(chars)
                logger.updateWindowText()
                return nil // Consume the keyboard event
            }
        }
        return Unmanaged.passRetained(event)
    }


    private func getLines() -> [String] {
        // First split by return characters to get separate lines
        let textByReturns = self.fullBuffer.joined().split(separator: "\r", omittingEmptySubsequences: false)
        var formattedLines: [String] = []

        for line in textByReturns {
            // Convert line to string to preserve all spaces
            let lineStr = String(line)

            // If line is empty or only contains spaces, add it as is
            if lineStr.isEmpty {
                formattedLines.append("")
                continue
            }

            // Split into chunks of maximum length while preserving all spaces
            var currentIndex = lineStr.startIndex
            while currentIndex < lineStr.endIndex {
                let remainingLength = lineStr.distance(from: currentIndex, to: lineStr.endIndex)
                let chunkLength = min(self.lineLength, remainingLength)
                let endIndex = lineStr.index(currentIndex, offsetBy: chunkLength)

                let chunk = String(lineStr[currentIndex..<endIndex])
                formattedLines.append(chunk)

                currentIndex = endIndex
            }
        }

        return formattedLines
    }

    private func getDisplayedText() -> String { //assume single spaces
        let lines = getLines()
        return lines.suffix(self.numLines).joined(separator: "\n") + "|"
    }

    private func updateWindowText() {
        DispatchQueue.main.async {
            if let window = self.floatingWindow {
                window.textField.stringValue = self.getDisplayedText()
            }
        }
    }


}









// probably dont care about thishello
class AppDelegate: NSObject, NSApplicationDelegate {
    let statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
    let keyLogger = KeyLogger()

    func applicationDidFinishLaunching(_ notification: Notification) {
        print("Application launching...")
        if let button = statusItem.button {
            button.image = NSImage(systemSymbolName: "keyboard", accessibilityDescription: "Keyboard Monitor")
        }

        keyLogger.startLogging()
    }
}



// main app
@main
struct KeyLoggerApp {
    static func main() {
        let app = NSApplication.shared
        let delegate = AppDelegate()
        app.delegate = delegate
        _ = NSApplicationMain(CommandLine.argc, CommandLine.unsafeArgv)
    }
}

