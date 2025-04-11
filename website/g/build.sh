#!/bin/bash

# Create the app bundle structure
mkdir -p KeyLogger.app/Contents/MacOS
mkdir -p KeyLogger.app/Contents/Resources

# Copy Info.plist
cp Info.plist KeyLogger.app/Contents/

# Build using Swift Package Manager
swift build -c release

# Copy the built binary
cp .build/release/KeyLogger KeyLogger.app/Contents/MacOS/

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
