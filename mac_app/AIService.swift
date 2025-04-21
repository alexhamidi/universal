import Foundation
import Cocoa

class AIService {
    static let shared = AIService()

    private static func timestampedMessage(_ message: String) -> String {
        let date = Date()
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm:ss.SSS"
        return "[\(formatter.string(from: date))] \(message)"
    }

    struct SubmitAPIResponse: Codable {
        let message: String
    }

    struct AgentAPIResponse: Codable {
        let action: String // JSON string of AgentAction
    }

    enum ActionType: String, Codable {
        case click
        case doubleClick = "double_click"
        case type
        case drag
    }

    struct AgentAction: Codable {
        let type: ActionType
        let coordinates: [Int]?
        let text: String?
        let start: [Int]?
        let end: [Int]?

        var finalCoordinates: (x: Int, y: Int)? {
            guard let coords = coordinates, coords.count == 2 else { return nil }
            return (coords[0], coords[1])
        }

        var startCoordinates: (x: Int, y: Int)? {
            guard let start = start, start.count == 2 else { return nil }
            return (start[0], start[1])
        }

        var endCoordinates: (x: Int, y: Int)? {
            guard let end = end, end.count == 2 else { return nil }
            return (end[0], end[1])
        }
    }

    func sendChat(_ text: String) async throws -> String {
        guard let baseURL = URL(string: "http://localhost:8003/api/submit"),
              var components = URLComponents(url: baseURL, resolvingAgainstBaseURL: true) else {
            return "Error occurred fetching: Invalid URL"
        }

        components.queryItems = [
            URLQueryItem(name: "text", value: text),
        ]

        guard let finalURL = components.url else {
            return "Error occurred fetching: Invalid URL parameters"
        }

        do {
            let (data, response) = try await URLSession.shared.data(from: finalURL)

            guard let httpResponse = response as? HTTPURLResponse,
                  (200...299).contains(httpResponse.statusCode) else {
                return "Error occurred fetching: Invalid server response"
            }

            let decoder = JSONDecoder()
            let apiResponse = try decoder.decode(SubmitAPIResponse.self, from: data)
            return apiResponse.message
        } catch {
            return "Error occurred: \(error.localizedDescription)"
        }
    }

    func runAgent(_ text: String) async throws -> String {
        guard let baseURL = URL(string: "http://localhost:8003/api/agent_round"),
              var components = URLComponents(url: baseURL, resolvingAgainstBaseURL: true) else {
            return "Error occurred fetching: Invalid URL"
        }

        components.queryItems = [
            URLQueryItem(name: "text", value: text),
        ]

        guard let finalURL = components.url else {
            return "Error occurred fetching: Invalid URL parameters"
        }

        do {
            let (data, response) = try await URLSession.shared.data(from: finalURL)

            guard let httpResponse = response as? HTTPURLResponse,
                  (200...299).contains(httpResponse.statusCode) else {
                return "Error occurred fetching: Invalid server response"
            }

            let decoder = JSONDecoder()
            let apiResponse = try decoder.decode(AgentAPIResponse.self, from: data)

            guard let actionData = apiResponse.action.data(using: .utf8) else {
                return "Invalid action response format"
            }

            let action = try JSONDecoder().decode(AgentAction.self, from: actionData)

            switch action.type {
            case .click, .doubleClick:
                guard let (x, y) = action.finalCoordinates,
                      let point = convertToScreenCoordinates(x: x, y: y) else {
                    return "Missing or invalid coordinates for click action"
                }

                if action.type == .click {
                    MouseUtils.shared.click(at: point)
                } else {
                    MouseUtils.shared.doubleClick(at: point)
                }
                return "Executed \(action.type) at (\(point.x), \(point.y))"

            case .type:
                guard let text = action.text else {
                    return "Missing text for type action"
                }
                // TODO: Implement typing functionality
                return "Type action not yet implemented: \(text)"

            case .drag:
                guard let (startX, startY) = action.startCoordinates,
                      let (endX, endY) = action.endCoordinates,
                      let startPoint = convertToScreenCoordinates(x: startX, y: startY),
                      let endPoint = convertToScreenCoordinates(x: endX, y: endY) else {
                    return "Missing or invalid coordinates for drag action"
                }
                // TODO: Implement drag functionality
                return "Drag action not yet implemented: from \(startPoint) to \(endPoint)"
            }
        } catch {
            print(AIService.timestampedMessage("Error: \(error)"))
            return "Error occurred: \(error.localizedDescription)"
        }
    }

    private func convertToScreenCoordinates(x: Int, y: Int) -> CGPoint? {
        guard let screen = NSScreen.main else { return nil }

        print(AIService.timestampedMessage("Starting Coordinates: (\(x), \(y))"))

        let screenFrame = screen.frame

        print(AIService.timestampedMessage("Screen frame: \(screenFrame)"))

        let point = CGPoint(x: x, y: y)
        print(AIService.timestampedMessage("Final screen coordinates: \(point)"))
        return point
    }
}

// Extension to safely access array elements
extension Array {
    subscript(safe index: Index) -> Element? {
        return indices.contains(index) ? self[index] : nil
    }
}
