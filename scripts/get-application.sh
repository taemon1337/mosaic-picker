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

echo "Getting application configuration..."
curl -X GET "${AUTH_AUTH0_ISSUER}/api/v2/clients/${AUTH_AUTH0_ID}" \
-H "Authorization: Bearer ${TOKEN}" \
-H "Content-Type: application/json" | jq '.'
