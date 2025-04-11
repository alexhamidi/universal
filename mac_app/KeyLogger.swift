// Main app for keylogger

import Cocoa
import Carbon
import Foundation
import SwiftUI

// Log object - most important f
class KeyLogger: NSObject {
    private var eventTap: CFMachPort?
    private var commandPaletteWindow: NSWindow?
    private let maxDisplayedChars = 1000
    private let lineLength: Int = 32
    private let numLines: Int = 5

    private var isWindowVisible = false {
        didSet {
            updateWindowState()
        }
    }
    private var fullBuffer: [String] = [] {
        didSet {
            updateWindowText()
        }
    }
    private var isCommandKeyPressed = false
    private var isOptionKeyPressed = false

    // Add response state
    private var llmResponse: String = "" {
        didSet {
            updateWindowText()
        }
    }

    private var hostingController: NSHostingController<CommandPaletteView>?

    override init() {
        super.init()
        print("KeyLogger initializing...")
        ScreenshotUtils.shared.setupScreenshotsDirectory()
        setupCommandPaletteWindow()
    }

    // handle submit text
    private func handleSubmit() {
        let currentText = fullBuffer.joined()
        if currentText.isEmpty {
            return
        }
        Task {
            do {
                guard let screenshotPath = ScreenshotUtils.shared.captureScreenshot() else {
                    print("Failed to capture screenshot")
                    return
                }
                print("Captured screenshot at: \(screenshotPath)")
                let response = try await AIService.shared.submitPrompt(currentText, screenshotPath) // request or keep api?
                self.llmResponse = response
                // fullBuffer.removeAll()
                // Text()
            } catch {
                print("Error submitting prompt: \(error)")
            }
        }
    }

    // handle keyboard events
    let callback: CGEventTapCallBack = { proxy, type, event, refcon in
        let logger = Unmanaged<KeyLogger>.fromOpaque(refcon!).takeUnretainedValue()

        // action \in {cmdUpdated, optionUpdated, toggle, backspace, altBackspace, cmdBackspace, submit, nil, }

        let eventType = KeyUtils.shared.getEventType(type, event)
        if eventType != "toggle" && eventType != "cmdUpdated" && eventType != "optionUpdated" && !logger.isWindowVisible {
            return Unmanaged.passRetained(event)
        }
        switch eventType {
            case "cmdUpdated":
                logger.isCommandKeyPressed = !logger.isCommandKeyPressed
            case "optionUpdated":
                logger.isOptionKeyPressed = !logger.isOptionKeyPressed
            case "toggle":
                DispatchQueue.main.async {
                    logger.isWindowVisible.toggle()
                }
                return nil
            case "backspace":
                if !logger.fullBuffer.isEmpty {
                    logger.fullBuffer.removeLast()
                    return nil
                }
            case "altBackspace":
                if !logger.fullBuffer.isEmpty {
                    var deletedChar = logger.fullBuffer.last ?? ""
                    while !logger.fullBuffer.isEmpty && deletedChar.trimmingCharacters(in: .whitespaces).isEmpty {
                        logger.fullBuffer.removeLast()
                        deletedChar = logger.fullBuffer.last ?? ""
                    }
                    while !logger.fullBuffer.isEmpty && !deletedChar.trimmingCharacters(in: .whitespaces).isEmpty {
                        logger.fullBuffer.removeLast()
                        deletedChar = logger.fullBuffer.last ?? ""
                    }
                    return nil
                }
            case "cmdBackspace":
                if !logger.fullBuffer.isEmpty {
                    logger.fullBuffer.removeAll()
                    return nil
                }
            case "submit":
                logger.handleSubmit()
                return nil
            case nil:
                return Unmanaged.passRetained(event)
            default:
                if let chars = eventType {
                    logger.fullBuffer.append(chars)
                    return nil
                }
        }

        return Unmanaged.passRetained(event)
    }

    // ================================================================
    // Similar to useffect - these run on updates to text dynamically to update the ui.
    // ================================================================


    private func updateWindowState() {
        DispatchQueue.main.async {
            if self.isWindowVisible {
                if self.commandPaletteWindow == nil {
                    self.setupCommandPaletteWindow()
                }
                self.commandPaletteWindow?.makeKeyAndOrderFront(nil)
            } else {
                self.commandPaletteWindow?.orderOut(nil)
                // self.fullBuffer.removeAll()
                // self.llmResponse = ""
            }

            // Update SwiftUI view
            self.hostingController?.rootView = self.getCommandPaletteView()
        }
    }

    // ================================================================
    // Similar to useffect - these run on updates to text dynamically to update the ui.
    // ================================================================


    private func getCommandPaletteView() -> CommandPaletteView {
        return CommandPaletteView(
                isVisible: .init(
                    get: { self.isWindowVisible },
                    set: { self.isWindowVisible = $0 }
                ),
                text: .init(
                    get: { self.fullBuffer.joined()  },
                    set: { newValue in
                        self.fullBuffer = [newValue]
                    }
                ),
                llmResponse: self.llmResponse,
                onSubmit: { self.handleSubmit() }
            )
    }

    private func updateWindowText() {
        DispatchQueue.main.async {
            self.hostingController?.rootView = self.getCommandPaletteView()
        }
    }

    // ================================================================
    // NOT IMPORTANT
    // ================================================================

    private func setupCommandPaletteWindow() {
        let contentView = self.getCommandPaletteView()
        hostingController = NSHostingController(rootView: contentView)
        commandPaletteWindow = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 600, height: 80),
            styleMask: [.borderless],
            backing: .buffered,
            defer: false
        )

        commandPaletteWindow?.contentViewController = hostingController
        commandPaletteWindow?.level = .statusBar
        commandPaletteWindow?.backgroundColor = .clear
        commandPaletteWindow?.isOpaque = false
        commandPaletteWindow?.hasShadow = true

        // Position window at the top left of the screen
        if let screen = NSScreen.main {
            let screenHeight = screen.frame.height
            let windowHeight: CGFloat = 80
            let yPosition = screenHeight - windowHeight + 60  // 20px from top
            commandPaletteWindow?.setFrameTopLeftPoint(NSPoint(x: 20, y: yPosition))  // 20px from left edge
        }

        commandPaletteWindow?.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary]
        commandPaletteWindow?.ignoresMouseEvents = false
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
            fullBuffer = ["Failed to create event tap"]
            return
        }

        eventTap = tap
        let runLoopSource = CFMachPortCreateRunLoopSource(kCFAllocatorDefault, tap, 0)
        CFRunLoopAddSource(CFRunLoopGetCurrent(), runLoopSource, .commonModes)
        CGEvent.tapEnable(tap: tap, enable: true)

        print("Keyboard monitoring started successfully")
    }

    private func checkInputMonitoringPermission() -> Bool {
        let trusted = CGPreflightListenEventAccess()
        if !trusted {
            print("Requesting input monitoring permission...")
            let success = CGRequestListenEventAccess()
            return success
        }
        return trusted
    }
}
