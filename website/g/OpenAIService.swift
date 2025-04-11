import Foundation

class OpenAIService {
    static let shared = OpenAIService()
    private let apiKey: String
    private let session: URLSession

    private let SYSTEM_PROMPT = "You are a helpful assistant that answer's a user's query. You have been provided with an image of their screen, you may use it as context if you wish."
    private init() {
        guard let apiKey = ProcessInfo.processInfo.environment["OPENAI_API_KEY"] else {
            fatalError("OpenAI API key not found in environment variables")
        }
        self.apiKey = apiKey
        self.session = URLSession.shared
    }

    func submitPrompt(_ text: String, _ screenshotPath: String) async throws -> String {
        print("input: \(text)")
        let url = URL(string: "https://api.openai.com/v1/chat/completions")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        // Read and encode the image
        let imageData = try Data(contentsOf: URL(fileURLWithPath: screenshotPath))
        let base64Image = imageData.base64EncodedString()

        // Create the message content with both text and image
        let messageContent: [[String: Any]] = [
            ["type": "text", "text": text],
            [
                "type": "image_url",
                "image_url": [
                    "url": "data:image/jpeg;base64,\(base64Image)",
                    "detail": "auto"
                ]
            ]
        ]

        let body: [String: Any] = [
            "model": "gpt-4o-mini",
            "messages": [
                ["role": "system", "content": SYSTEM_PROMPT],
                ["role": "user", "content": messageContent]
            ]
        ]

        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, _) = try await session.data(for: request)
        let json = try JSONSerialization.jsonObject(with: data) as? [String: Any]
        let choices = json?["choices"] as? [[String: Any]]
        let message = choices?.first?["message"] as? [String: Any]
        let content = message?["content"] as? String ?? "No response"

        print("OpenAI response: \(content)")
        return content
    }
}
