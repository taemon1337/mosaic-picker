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

echo "Getting connection configuration..."
curl -X GET "${AUTH_AUTH0_ISSUER}/api/v2/connections/${AUTH_AUTH0_GOOGLE_CONNECTION_ID}" \
-H "Authorization: Bearer ${TOKEN}" \
-H "Content-Type: application/json" | jq '.options.scope'

echo -e "\nGetting enabled clients for connection..."
curl -X GET "${AUTH_AUTH0_ISSUER}/api/v2/connections/${AUTH_AUTH0_GOOGLE_CONNECTION_ID}/enabled_clients" \
-H "Authorization: Bearer ${TOKEN}" \
-H "Content-Type: application/json" | jq '.'
