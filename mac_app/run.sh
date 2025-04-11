#!/bin/bash

# Source the .env file to load environment variables
export $(cat .env | xargs)

# Run the build script first
./build.sh

# Launch Python server in the background
python3 python/app.py &


./KeyLogger.app/Contents/MacOS/KeyLogger
