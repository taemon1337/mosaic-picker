#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
source "${SCRIPT_DIR}/../.env"

echo "Getting management token..."
TOKEN_RESPONSE=$(curl --request POST \
  --url "https://${AUTH_AUTH0_MGMT_DOMAIN}/oauth/token" \
  --header 'content-type: application/json' \
  --data "{
    \"client_id\": \"${AUTH_AUTH0_MGMT_ID}\",
    \"client_secret\": \"${AUTH_AUTH0_MGMT_SECRET}\",
    \"audience\": \"https://${AUTH_AUTH0_MGMT_DOMAIN}/api/v2/\",
    \"grant_type\": \"client_credentials\",
    \"scope\": \"update:clients read:clients\"
  }")

echo "Token response:"
echo "${TOKEN_RESPONSE}" | jq '.'

TOKEN=$(echo "${TOKEN_RESPONSE}" | jq -r '.access_token')

if [ -z "${TOKEN}" ] || [ "${TOKEN}" = "null" ]; then
  echo "Failed to get management token"
  exit 1
fi

echo "Updating application..."
curl -X PATCH "https://${AUTH_AUTH0_MGMT_DOMAIN}/api/v2/clients/${AUTH_AUTH0_ID}" \
-H "Authorization: Bearer ${TOKEN}" \
-H "Content-Type: application/json" \
-d "{
  \"callbacks\": [\"http://localhost:5173/auth/callback/auth0\", \"http://localhost:3000/auth/callback/auth0\"],
  \"allowed_logout_urls\": [\"http://localhost:5173\", \"http://localhost:3000\"],
  \"web_origins\": [\"http://localhost:5173\", \"http://localhost:3000\"],
  \"allowed_origins\": [\"http://localhost:5173\", \"http://localhost:3000\"],
  \"grant_types\": [\"authorization_code\", \"implicit\", \"refresh_token\"],
  \"jwt_configuration\": {
    \"alg\": \"RS256\"
  },
  \"token_endpoint_auth_method\": \"client_secret_post\",
  \"app_type\": \"regular_web\",
  \"oidc_conformant\": true,
  \"refresh_token\": {
    \"rotation_type\": \"rotating\",
    \"expiration_type\": \"expiring\",
    \"leeway\": 0,
    \"token_lifetime\": 2592000,
    \"infinite_token_lifetime\": false,
    \"infinite_idle_token_lifetime\": false,
    \"idle_token_lifetime\": 1296000
  },
  \"client_metadata\": {
    \"google_scopes\": \"https://www.googleapis.com/auth/photoslibrary.readonly https://www.googleapis.com/auth/photospicker.mediaitems.readonly\"
  }
}"

echo -e "\nVerifying update..."
sleep 2
curl -X GET "https://${AUTH_AUTH0_MGMT_DOMAIN}/api/v2/clients/${AUTH_AUTH0_ID}" \
-H "Authorization: Bearer ${TOKEN}" \
-H "Content-Type: application/json" | jq '.'
