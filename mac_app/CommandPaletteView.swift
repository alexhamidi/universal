import SwiftUI

struct CommandPaletteView: View {
    @Binding var isVisible: Bool
    @Binding var text: String
    @State private var isResponseVisible = false
    @Binding var inChatMode: Bool
    let llmResponse: String
    var onSubmit: () -> Void

    var body: some View {
        VStack(spacing: 8) {
            Picker("Mode:", selection: $inChatMode) {
                Text("Chat").tag(true)
                Text("Agent").tag(false)
            }
            .pickerStyle(.segmented)
            .padding(.horizontal, 12)

            TextField("What would you like to do?", text: $text, axis: .vertical)
                .textFieldStyle(PlainTextFieldStyle())
                .font(.system(size: 16))
                .lineLimit(3...5)
                .padding(12)
                .background(Color(NSColor.windowBackgroundColor).opacity(0.8))
                .cornerRadius(8)
                .onSubmit {
                    onSubmit()
                }

            if !llmResponse.isEmpty {
                Button(action: {
                    isResponseVisible.toggle()
                }) {
                    HStack {
                        Image(systemName: isResponseVisible ? "chevron.down" : "chevron.right")
                            .foregroundColor(.white)
                        Text("Response")
                            .foregroundColor(.white)
                        Text("(\(llmResponse.count) chars)")
                            .foregroundColor(.gray)
                        Spacer()
                    }
                    .padding(.horizontal, 12)
                }
                .buttonStyle(PlainButtonStyle())

                if isResponseVisible {
                    Text(llmResponse)
                        .font(.system(size: 14))
                        .foregroundColor(.white)
                        .lineLimit(nil)
                        .fixedSize(horizontal: false, vertical: true)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(12)
                        .textSelection(.enabled)
                        .background(Color(NSColor.windowBackgroundColor).opacity(0.6))
                        .cornerRadius(8)
                }
            }
        }
        .frame(width: 400)
        .padding()
        .background(Color(NSColor.windowBackgroundColor).opacity(0.6))
        .cornerRadius(12)
    }
}
