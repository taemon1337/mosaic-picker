#!/bin/bash

source ../.env

# Get management token
TOKEN=$(curl --request POST \
  --url "${AUTH_AUTH0_ISSUER}/oauth/token" \
  --header 'content-type: application/json' \
  --data "{
    \"client_id\": \"${AUTH_AUTH0_MGMT_ID}\",
    \"client_secret\": \"${AUTH_AUTH0_MGMT_SECRET}\",
    \"audience\": \"${AUTH_AUTH0_ISSUER}/api/v2/\",
    \"grant_type\": \"client_credentials\"
  }" | jq -r '.access_token')

# Get the user's permissions
echo "Getting user permissions..."
curl -X GET "${AUTH_AUTH0_ISSUER}/api/v2/users/${AUTH0_USER_ID}/permissions" \
-H "Authorization: Bearer ${TOKEN}" \
-H "Content-Type: application/json" | jq '.'

# Get the user's granted scopes
echo -e "\nGetting user identity..."
curl -X GET "${AUTH_AUTH0_ISSUER}/api/v2/users/${AUTH0_USER_ID}" \
-H "Authorization: Bearer ${TOKEN}" \
-H "Content-Type: application/json" | jq '.identities[] | select(.provider == "google-oauth2")'
