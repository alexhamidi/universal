import SwiftUI
import HotKey
import LaunchAtLogin
import Carbon

class WindowManager: ObservableObject {
    static let shared = WindowManager()

    // Window dimensions
    let baseSize = NSSize(width: 600, height: 180)

    @Published var isVisible = false
    @Published var inputText = ""
    @Published var isProcessing = false

    private var mainHotKey: HotKey?
    private var eventTap: CFMachPort?
    private var isCommandKeyPressed = false
    private var isOptionKeyPressed = false
    private var hasSetupMonitoring = false
    private var mainWindow: Panel?

    init() {
        setupMonitoring()
        setupHotkey()
    }

    private func setupHotkey() {
        // Default hotkey is Command + ;
        mainHotKey = HotKey(key: .semicolon, modifiers: [.command])
        mainHotKey?.keyDownHandler = { [weak self] in
            self?.toggle()
        }
    }

    private func setupMonitoring() {
        if hasSetupMonitoring { return }

        let trusted = CGPreflightListenEventAccess()
        if !trusted {
            let success = CGRequestListenEventAccess()
            if success {
                relaunchApp()
            } else {
                print("Permission denied")
            }
        } else {
            setupKeyboardMonitoring()
            DispatchQueue.main.async { [weak self] in
                self?.initializeWindow()
            }
        }
    }

    private func initializeWindow() {
        mainWindow = Panel(contentRect: .zero)
        mainWindow?.contentView?.addSubview(NSHostingView(rootView: FloatingWindowView()))
        resetSize()
    }

    private func resetSize() {
        guard let mainWindow = mainWindow else { return }
        let origin = CGPoint(x: 0, y: 0)
        let frame = NSRect(origin: origin, size: baseSize)
        mainWindow.setFrame(frame, display: false)
        mainWindow.center()
    }

    private func relaunchApp() {
        guard let executablePath = Bundle.main.executablePath else { return }
        let appPath = (executablePath as NSString).deletingLastPathComponent
        let parentPath = (appPath as NSString).deletingLastPathComponent
        let bundlePath = (parentPath as NSString).deletingLastPathComponent

        let process = Process()
        process.executableURL = URL(fileURLWithPath: "/usr/bin/open")
        process.arguments = [bundlePath]

        do {
            DispatchQueue.main.async {
                NSApp.terminate(nil)
            }
            try process.run()
        } catch {
            print("Failed to relaunch: \(error)")
        }
    }

    private func setupKeyboardMonitoring() {
        if hasSetupMonitoring { return }
        hasSetupMonitoring = true

        let eventMask = (1 << CGEventType.keyDown.rawValue) | (1 << CGEventType.flagsChanged.rawValue)

        guard let tap = CGEvent.tapCreate(
            tap: .cgSessionEventTap,
            place: .headInsertEventTap,
            options: .defaultTap,
            eventsOfInterest: CGEventMask(eventMask),
            callback: eventCallback,
            userInfo: UnsafeMutableRawPointer(Unmanaged.passUnretained(self).toOpaque())
        ) else {
            print("Failed to create event tap")
            return
        }

        eventTap = tap
        let runLoopSource = CFMachPortCreateRunLoopSource(kCFAllocatorDefault, tap, 0)
        CFRunLoopAddSource(CFRunLoopGetCurrent(), runLoopSource, .commonModes)
        CGEvent.tapEnable(tap: tap, enable: true)
    }

    let eventCallback: CGEventTapCallBack = { proxy, type, event, refcon in
        let manager = Unmanaged<WindowManager>.fromOpaque(refcon!).takeUnretainedValue()

        if type == .flagsChanged {
            let flags = event.flags
            manager.isCommandKeyPressed = flags.contains(.maskCommand)
            manager.isOptionKeyPressed = flags.contains(.maskAlternate)
        } else if type == .keyDown {
            let keycode = event.getIntegerValueField(.keyboardEventKeycode)

            // Handle Enter key when window is visible
            if keycode == 36 && manager.isVisible {
                Task {
                    await manager.submit()
                }
                return nil
            }
        }

        return Unmanaged.passRetained(event)
    }

    func toggle() {
        if isVisible {
            hideWindow()
        } else {
            showWindow()
        }
    }

    func showWindow() {
        guard let mainWindow = mainWindow, !isVisible else { return }

        DispatchQueue.main.async {
            self.isVisible = true
            mainWindow.setIsVisible(false)
            mainWindow.makeKeyAndOrderFront(self)

            // Position window on screen
            if let screen = NSScreen.main {
                let yOffset = screen.visibleFrame.height * 0.3
                let x = screen.visibleFrame.midX - self.baseSize.width / 2
                let y = screen.visibleFrame.midY - mainWindow.frame.height + yOffset
                mainWindow.setFrameOrigin(NSPoint(x: floor(x), y: floor(y)))
            }

            mainWindow.makeKeyAndOrderFront(self)
            mainWindow.setIsVisible(true)
            NSApp.activate(ignoringOtherApps: true)
        }
    }

    func hideWindow() {
        guard let mainWindow = mainWindow, isVisible else { return }

        DispatchQueue.main.async {
            mainWindow.orderOut(self)
            self.isVisible = false
            self.inputText = ""
        }
    }

    func submit() async {
        guard !inputText.isEmpty else { return }
        isProcessing = true
        defer { isProcessing = false }

        do {
            guard let screenshotPath = ScreenshotManager.shared.captureScreenshot() else {
                print("Failed to capture screenshot")
                return
            }

            let _ = try await OpenAIService.shared.submitPrompt(inputText, screenshotPath)

            DispatchQueue.main.async {
                self.inputText = ""
                self.hideWindow()
            }
        } catch {
            print("Error submitting prompt: \(error)")
        }
    }
}

// Helper to manage window presentation
class FloatingWindowController: NSWindowController {
    // Add a strong reference to the delegate
    private var windowDelegateInstance: NSWindowDelegate?

    convenience init(view: FloatingWindowView) {
        // Create window as NSPanel directly since we know it's an NSPanel
        let window = NSPanel(
            contentRect: NSRect(x: 0, y: 0, width: 600, height: 180),
            styleMask: [.nonactivatingPanel, .titled, .resizable, .fullSizeContentView],
            backing: .buffered,
            defer: false
        )

        window.setFrame(NSRect(
            x: (NSScreen.main?.frame.width ?? 1440) / 2 - 300,
            y: (NSScreen.main?.frame.height ?? 900) - 200,
            width: 600,
            height: 180
        ), display: false)

        window.contentView = NSHostingView(rootView: view)
        window.backgroundColor = .clear
        window.level = .popUpMenu
        window.isOpaque = false
        window.hasShadow = true
        window.isMovableByWindowBackground = true
        window.hidesOnDeactivate = false

        // Configure panel properties directly since we know it's an NSPanel
        window.worksWhenModal = true
        window.isFloatingPanel = true

        // Initialize first
        self.init(window: window)

        // Then set up delegate after initialization
        let delegate = ActivatingWindowDelegate()
        window.delegate = delegate
        self.windowDelegateInstance = delegate
    }

    override func showWindow(_ sender: Any?) {
        window?.makeKeyAndOrderFront(nil) // Use makeKeyAndOrderFront instead of orderFront
    }
}

// Custom field editor that doesn't activate the window
class NonActivatingFieldEditor: NSTextView {
    override var acceptsFirstResponder: Bool { true }

    override func becomeFirstResponder() -> Bool {
        // Accept first responder status without activating window
        super.becomeFirstResponder()
        return true
    }
}

// Changed window delegate to allow becoming key
class ActivatingWindowDelegate: NSObject, NSWindowDelegate {
    func windowShouldBecomeKey(_ window: NSWindow) -> Bool {
        return true
    }

    func windowShouldBecomeMain(_ window: NSWindow) -> Bool {
        return true
    }

    // Add windowDidBecomeKey to ensure the window gets focus
    func windowDidBecomeKey(_ notification: Notification) {
        if let window = notification.object as? NSWindow,
           let hostingView = window.contentView as? NSHostingView<FloatingWindowView> {
            // This will help ensure the SwiftUI view gets focus
            window.makeFirstResponder(hostingView)
        }
    }
}

