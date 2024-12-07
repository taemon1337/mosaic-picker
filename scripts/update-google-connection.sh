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
    \"scope\": \"update:connections read:connections\"
  }")

echo "Token response:"
echo "${TOKEN_RESPONSE}" | jq '.'

TOKEN=$(echo "${TOKEN_RESPONSE}" | jq -r '.access_token')

if [ -z "${TOKEN}" ] || [ "${TOKEN}" = "null" ]; then
  echo "Failed to get management token"
  exit 1
fi

echo "Updating Google Photos connection..."
curl -X PATCH "https://${AUTH_AUTH0_MGMT_DOMAIN}/api/v2/connections/${AUTH_AUTH0_GOOGLE_CONNECTION_ID}" \
-H "Authorization: Bearer ${TOKEN}" \
-H "Content-Type: application/json" \
-d "{
  \"options\": {
    \"scope\": [
      \"email\",
      \"profile\",
      \"openid\",
      \"https://www.googleapis.com/auth/photoslibrary.readonly\",
      \"https://www.googleapis.com/auth/photospicker.mediaitems.readonly\"
    ],
    \"additional_parameters\": {
      \"access_type\": \"offline\",
      \"include_granted_scopes\": \"true\",
      \"prompt\": \"consent select_account\"
    }
  },
  \"enabled_clients\": [\"${AUTH_AUTH0_ID}\"]
}"

echo -e "\nVerifying update..."
sleep 2
curl -X GET "https://${AUTH_AUTH0_MGMT_DOMAIN}/api/v2/connections/${AUTH_AUTH0_GOOGLE_CONNECTION_ID}" \
-H "Authorization: Bearer ${TOKEN}" \
-H "Content-Type: application/json" | jq '.'
