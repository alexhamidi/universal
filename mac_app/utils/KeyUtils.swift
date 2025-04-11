import Cocoa
import Foundation
import Carbon
        // action \in {cmdUpdated, optionUpdated, toggle, backspace, altBackspace, cmdBackspace, submit, nil, }

public class KeyUtils {
    static let shared = KeyUtils()

    func getEventType(_ type: CGEventType, _ event: CGEvent) -> String? {
        let flags = event.flags

        // Check for command key press
        if type == .flagsChanged {
            // Check for command key state
            if flags.contains(.maskCommand) {
                return "cmdUpdated"
            } else if flags.contains(.maskAlternate) {
                return "optionUpdated"
            }
            return nil  // No relevant flag changes
        }

        if type != .flagsChanged && type != .keyDown {
            return nil
        }

        let keycode = event.getIntegerValueField(.keyboardEventKeycode)

        // Command + ; (semicolon) for toggle
        if flags.contains(.maskCommand) && keycode == 41 {
            return "toggle"
        }

        // Command + Enter for submit
        if flags.contains(.maskCommand) && keycode == 36 {
            return "submit"
        }

        // Handle backspace with modifiers
        if keycode == 51 {
            if flags.contains(.maskCommand) {
                return "cmdBackspace"
            } else if flags.contains(.maskAlternate) {
                return "altBackspace"
            } else {
                return "backspace"
            }
        }

        // Handle text input
        var actualStringLength: Int = 0
        var unicodeString = [UniChar](repeating: 0, count: 4)

        event.keyboardGetUnicodeString(
            maxStringLength: 4,
            actualStringLength: &actualStringLength,
            unicodeString: &unicodeString
        )

        if actualStringLength > 0 && !flags.contains(.maskCommand) {
            return String(utf16CodeUnits: unicodeString, count: actualStringLength)
        }

        return nil
    }
}
