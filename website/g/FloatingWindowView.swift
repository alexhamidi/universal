import SwiftUI

struct FloatingWindowView: View {
    @StateObject private var windowManager = WindowManager.shared
    @FocusState private var isTextFieldFocused: Bool

    var body: some View {
        VStack {
            TextField("Ask anything...", text: $windowManager.inputText)
                .textFieldStyle(PlainTextFieldStyle())
                .font(.system(size: 16))
                .padding()
                .background(Color(NSColor.controlBackgroundColor))
                .cornerRadius(8)
                .focused($isTextFieldFocused)
                .onAppear {
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                        isTextFieldFocused = true
                    }
                }
                .onChange(of: windowManager.isVisible) { isVisible in
                    if isVisible {
                        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                            isTextFieldFocused = true
                        }
                    }
                }
                .onSubmit {
                    Task {
                        await windowManager.submit()
                    }
                }
        }
        .padding()
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(
            VisualEffectView(material: .headerView, blendingMode: .behindWindow)
                .ignoresSafeArea()
        )
    }
}

// Helper view to use NSVisualEffectView in SwiftUI
struct VisualEffectView: NSViewRepresentable {
    let material: NSVisualEffectView.Material
    let blendingMode: NSVisualEffectView.BlendingMode

    func makeNSView(context: Context) -> NSVisualEffectView {
        let visualEffectView = NSVisualEffectView()
        visualEffectView.material = material
        visualEffectView.blendingMode = blendingMode
        visualEffectView.state = .active
        return visualEffectView
    }

    func updateNSView(_ visualEffectView: NSVisualEffectView, context: Context) {
        visualEffectView.material = material
        visualEffectView.blendingMode = blendingMode
    }
}

// #Preview {
//     FloatingWindowView()
// }
