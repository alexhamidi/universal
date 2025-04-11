// Main app for keylogger

import Cocoa
import Carbon
import Foundation
import SwiftUI
import LaunchAtLogin
import HotKey

@main
struct KeyLoggerApp: App {
    @StateObject private var windowManager = WindowManager.shared

    init() {
        // print("KeyLoggerApp initializing...")
        // Request permissions if needed
        if !CGPreflightListenEventAccess() {
            // print("Requesting input monitoring permission...")
            _ = CGRequestListenEventAccess()
        }
    }

    var body: some Scene {
        MenuBarExtra("KeyLogger", systemImage: "keyboard") {
            VStack {
                Toggle("Launch at Login", isOn: .init(
                    get: { LaunchAtLogin.isEnabled },
                    set: { LaunchAtLogin.isEnabled = $0 }
                ))
                Divider()
                Button("Quit") {
                    NSApplication.shared.terminate(nil)
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
        }
        .menuBarExtraStyle(.window)

        WindowGroup("Floating Window") {
            FloatingWindowView()
        }
        .onChange(of: windowManager.isVisible) { isVisible in
            // print("Window visibility changed to: \(isVisible)")
        }
    }
}

