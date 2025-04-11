#!/bin/bash

# Source the .env file to load environment variables
export $(cat .env | xargs)

# Run the application
./KeyLogger.app/Contents/MacOS/KeyLogger
