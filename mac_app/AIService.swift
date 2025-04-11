import Foundation
import Cocoa

class AIService {
    static let shared = AIService()

    struct SubmitAPIResponse: Codable {
        let message: String
    }

    struct AgentAPIResponse: Codable {
        let tool_response: String
    }

    struct AgentAction: Codable {
        let type: String
        let coordinates: CoordinateFormat?
        let x: Int?
        let y: Int?

        // Get the final x,y coordinates regardless of format
        var finalX: Int? {
            if let x = x {
                return x
            }
            return coordinates?.x
        }

        var finalY: Int? {
            if let y = y {
                return y
            }
            return coordinates?.y
        }
    }

    enum CoordinateFormat: Codable {
        case array([Int])
        case object(x: Int, y: Int)

        init(from decoder: Decoder) throws {
            let container = try decoder.singleValueContainer()
            print("Decoding CoordinateFormat, raw value: \(try? container.decode(String.self))")

            if let array = try? container.decode([Int].self) {
                print("Decoded array format: \(array)")
                self = .array(array)
            } else if let dict = try? container.decode([String: Int].self) {
                print("Decoded object format: \(dict)")
                if let x = dict["x"], let y = dict["y"] {
                    self = .object(x: x, y: y)
                } else {
                    throw DecodingError.dataCorruptedError(in: container, debugDescription: "Missing x/y in object")
                }
            } else {
                print("Failed to decode as array or object")
                throw DecodingError.dataCorruptedError(in: container, debugDescription: "Invalid coordinate format")
            }
        }

        var x: Int {
            switch self {
            case .array(let coords): return coords[0]
            case .object(let x, _): return x
            }
        }

        var y: Int {
            switch self {
            case .array(let coords): return coords[1]
            case .object(_, let y): return y
            }
        }
    }

    struct AgentToolResponse: Codable {
        let action: AgentAction
        let explanation: String
    }

    func sendChat(_ text: String) async throws -> String {
        let screenshotPath = ScreenshotUtils.shared.captureScreenshot()
        guard let baseURL = URL(string: "http://localhost:8003/api/submit"),
              var components = URLComponents(url: baseURL, resolvingAgainstBaseURL: true) else {
            return "Error occurred fetching: Invalid URL"
        }

        // Add query parameters
        components.queryItems = [
            URLQueryItem(name: "text", value: text),
            URLQueryItem(name: "screenshot_path", value: screenshotPath)
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
        } catch let decodingError as DecodingError {
            return "Error occurred parsing response: \(decodingError.localizedDescription)"
        } catch {
            return "Error occurred fetching: \(error.localizedDescription)"
        }
    }

    func runAgent(_ text: String) async throws -> String {
        let screenshotPath = ScreenshotUtils.shared.captureScreenshot()
        guard let baseURL = URL(string: "http://localhost:8003/api/agent_round"),
              var components = URLComponents(url: baseURL, resolvingAgainstBaseURL: true) else {
            return "Error occurred fetching: Invalid URL"
        }

        components.queryItems = [
            URLQueryItem(name: "text", value: text),
            URLQueryItem(name: "screenshot_path", value: screenshotPath)
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
            let toolResponse = apiResponse.tool_response
            print("received response from agent: \(toolResponse)")

            guard let toolResponseData = toolResponse.data(using: .utf8) else {
                return "Invalid tool response format"
            }

            let agentResponse = try JSONDecoder().decode(AgentToolResponse.self, from: toolResponseData)

            guard let x = agentResponse.action.finalX,
                  let y = agentResponse.action.finalY else {
                return "Missing coordinates in response"
            }

            print("Successfully extracted coordinates: (\(x), \(y))")

            guard let point = convertToScreenCoordinates(x: x, y: y) else {
                return "Failed to convert coordinates to screen space"
            }

            print("Attempting to click at screen coordinates: \(point)")

            switch agentResponse.action.type {
            case "click":
                MouseUtils.shared.click(at: point)
            case "double_click":
                MouseUtils.shared.doubleClick(at: point)
            case "right_click":
                MouseUtils.shared.rightClick(at: point)
            default:
                print("Unsupported action type: \(agentResponse.action.type)")
            }

            return "Executed action: \(agentResponse.action.type) at (\(point.x), \(point.y)). Explanation: \(agentResponse.explanation)"
        } catch let decodingError as DecodingError {
            print("Decoding error: \(decodingError)")
            return "Error occurred parsing response: \(decodingError.localizedDescription)"
        } catch {
            print("Network or decoding error: \(error)")
            return "Error occurred: \(error.localizedDescription)"
        }
    }

    private func convertToScreenCoordinates(x: Int, y: Int) -> CGPoint? {
        guard let screen = NSScreen.main else { return nil }

        // Get the screen's frame in Cocoa coordinates (origin at bottom-left)
        let screenFrame = screen.frame

        // Convert the coordinates to screen space
        let screenX = CGFloat(x)
        // Convert Y coordinate from top-left to bottom-left origin
        let screenY = screenFrame.height - CGFloat(y)

        print("Converting coordinates: (\(x), \(y)) -> (\(screenX), \(screenY))")
        print("Screen frame: \(screenFrame)")

        // Ensure coordinates are within screen bounds with some padding
        let padding: CGFloat = 50
        guard screenX >= -padding && screenX <= screenFrame.width + padding &&
              screenY >= -padding && screenY <= screenFrame.height + padding else {
            print("Coordinates out of screen bounds: (\(screenX), \(screenY))")
            return nil
        }

        // Clamp coordinates to screen bounds
        let clampedX = max(0, min(screenX, screenFrame.width))
        let clampedY = max(0, min(screenY, screenFrame.height))

        let point = CGPoint(x: clampedX, y: clampedY)
        print("Final screen coordinates: \(point)")
        return point
    }
}

// Extension to safely access array elements
extension Array {
    subscript(safe index: Index) -> Element? {
        return indices.contains(index) ? self[index] : nil
    }
}
