import Foundation

class AIService {
    static let shared = AIService()

    struct APIResponse: Codable {
        let message: String
    }

    func submitPrompt(_ text: String, _ screenshotPath: String) async throws -> String {
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
            let apiResponse = try decoder.decode(APIResponse.self, from: data)
            return apiResponse.message
        } catch let decodingError as DecodingError {
            return "Error occurred parsing response: \(decodingError.localizedDescription)"
        } catch {
            return "Error occurred fetching: \(error.localizedDescription)"
        }
    }
}
