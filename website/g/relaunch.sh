#!/bin/bash

# Kill any existing instances
pkill -f KeyLogger

# Wait a moment for the app to fully terminate
sleep 1

# Build the app
./build.sh

# Run the app directly with console output
./KeyLogger.app/Contents/MacOS/KeyLogger
