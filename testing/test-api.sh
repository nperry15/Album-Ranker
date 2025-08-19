#!/bin/bash

# Step 1: Login as admin
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"changeme123"}' | jq -r .token)

# Step 2: Check your admin token
echo "Admin token: $TOKEN"

# Step 3: Import a Spotify album (replace with a real album ID)
ALBUM_ID="4aawyAB9vmqN3uQ7FjRGTy"
curl -s -X POST http://localhost:4000/api/albums/import/$ALBUM_ID \
  -H "Authorization: Bearer $TOKEN" | jq

# Step 4: Search albums (public endpoint)
# QUERY="Pitbull"
# curl -s "http://localhost:4000/api/albums/search?q=$QUERY" | jq

# Step 5: Get current user info
curl -s -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq