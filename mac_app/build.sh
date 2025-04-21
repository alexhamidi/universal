#!/bin/bash

# Create the app bundle structure
mkdir -p KeyLogger.app/Contents/MacOS
mkdir -p KeyLogger.app/Contents/Resources

# Copy Info.plist
cp Info.plist KeyLogger.app/Contents/

# Compile the Swift files
swiftc -parse-as-library \
    KeyLogger.swift \
    CommandPaletteView.swift \
    AppDelegate.swift \
    KeyLoggerApp.swift \
    AIService.swift \
    utils/KeyUtils.swift \
    utils/MouseUtils.swift \
    -o KeyLogger.app/Contents/MacOS/KeyLogger \
    -framework Cocoa \
    -framework Carbon

# Make the binary executable
chmod +x KeyLogger.app/Contents/MacOS/KeyLogger

# Create a wrapper script that sets environment variables
cat > KeyLogger.app/Contents/MacOS/run.sh << 'EOF'
#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$DIR/../../../../.env"
exec "$DIR/KeyLogger"
EOF

chmod +x KeyLogger.app/Contents/MacOS/run.sh

echo "Build complete. You can now run KeyLogger.app"
