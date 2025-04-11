import Cocoa

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
