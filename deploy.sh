#!/bin/bash

# Variables
SERVER="root@194.238.22.144"
TARGET_DIR="/var/www/test.rateena-app.com"
ARCHIVE_NAME="build.tar.gz"
LOCAL_BUILD_DIR="build" # Change this if your build folder is named differently

# Build the project using bun
npm run build

# Compress the CONTENTS of the build folder (not the folder itself)
tar -czf $ARCHIVE_NAME -C $LOCAL_BUILD_DIR .

# Copy the archive to the server
scp $ARCHIVE_NAME $SERVER:/tmp/

# Deploy on the server
ssh $SERVER << EOF
  rm -rf $TARGET_DIR/*
  tar -xzf /tmp/$ARCHIVE_NAME -C $TARGET_DIR
  rm /tmp/$ARCHIVE_NAME
EOF

# Clean up local archive
rm $ARCHIVE_NAME

echo "Deployment complete."