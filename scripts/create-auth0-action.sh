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
    \"scope\": \"read:actions create:actions update:actions delete:actions\"
  }")

echo "Token response:"
echo "${TOKEN_RESPONSE}" | jq '.'

TOKEN=$(echo "${TOKEN_RESPONSE}" | jq -r '.access_token')

if [ -z "${TOKEN}" ] || [ "${TOKEN}" = "null" ]; then
  echo "Failed to get management token"
  exit 1
fi

# First, get the existing action ID
echo "Getting existing action..."
EXISTING_ACTION=$(curl -s -X GET "https://${AUTH_AUTH0_MGMT_DOMAIN}/api/v2/actions/actions" \
-H "Authorization: Bearer ${TOKEN}" \
-H "Content-Type: application/json" | jq -r '.[] | select(.name == "Add Google Photos Scopes")')

ACTION_ID=$(echo "${EXISTING_ACTION}" | jq -r '.id')

if [ -z "${ACTION_ID}" ] || [ "${ACTION_ID}" = "null" ]; then
  echo "Creating new action..."
  ACTION_RESPONSE=$(curl -X POST "https://${AUTH_AUTH0_MGMT_DOMAIN}/api/v2/actions/actions" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Add Google Photos Scopes",
    "supported_triggers": [
      {
        "id": "post-login",
        "version": "v3"
      }
    ],
    "code": "/**\n * Handler that will be called during the execution of a PostLogin flow.\n *\n * @param {Event} event - Details about the user and the context in which they are logging in.\n * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.\n */\nexports.onExecutePostLogin = async (event, api) => {\n  const connection = event.connection || {};\n  const connectionStrategy = connection.strategy;\n  \n  if (connectionStrategy === \"google-oauth2\") {\n    const namespace = \"https://mosaic-picker.example.com\";\n    const scopes = [\n      \"https://www.googleapis.com/auth/photoslibrary.readonly\",\n      \"https://www.googleapis.com/auth/photospicker.mediaitems.readonly\"\n    ];\n    \n    // Add the scopes to the ID token and Access token\n    api.idToken.setCustomClaim(`${namespace}/scopes`, scopes);\n    api.accessToken.setCustomClaim(`${namespace}/scopes`, scopes);\n    \n    // Log the action for debugging\n    console.log(\"Added Google Photos scopes to tokens\", {\n      userId: event.user.user_id,\n      scopes: scopes\n    });\n  }\n};\n\n/**\n * Handler that will be invoked when this action is resuming after an external redirect. If your\n * onExecutePostLogin function does not perform a redirect, this function can be safely ignored.\n *\n * @param {Event} event - Details about the user and the context in which they are logging in.\n * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.\n */\nexports.onContinuePostLogin = async (event, api) => {\n  // Not needed for this action\n};",
    "runtime": "node18",
    "dependencies": [],
    "secrets": []
  }')
  
  echo "Action creation response:"
  echo "${ACTION_RESPONSE}" | jq '.'
  
  ACTION_ID=$(echo "${ACTION_RESPONSE}" | jq -r '.id')
  
  if [ -z "${ACTION_ID}" ] || [ "${ACTION_ID}" = "null" ]; then
    echo "Failed to create action"
    exit 1
  fi
else
  echo "Updating existing action..."
  ACTION_RESPONSE=$(curl -X PATCH "https://${AUTH_AUTH0_MGMT_DOMAIN}/api/v2/actions/actions/${ACTION_ID}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "/**\n * Handler that will be called during the execution of a PostLogin flow.\n *\n * @param {Event} event - Details about the user and the context in which they are logging in.\n * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.\n */\nexports.onExecutePostLogin = async (event, api) => {\n  const connection = event.connection || {};\n  const connectionStrategy = connection.strategy;\n  \n  if (connectionStrategy === \"google-oauth2\") {\n    const namespace = \"https://mosaic-picker.example.com\";\n    const scopes = [\n      \"https://www.googleapis.com/auth/photoslibrary.readonly\",\n      \"https://www.googleapis.com/auth/photospicker.mediaitems.readonly\"\n    ];\n    \n    // Add the scopes to the ID token and Access token\n    api.idToken.setCustomClaim(`${namespace}/scopes`, scopes);\n    api.accessToken.setCustomClaim(`${namespace}/scopes`, scopes);\n    \n    // Log the action for debugging\n    console.log(\"Added Google Photos scopes to tokens\", {\n      userId: event.user.user_id,\n      scopes: scopes\n    });\n  }\n};\n\n/**\n * Handler that will be invoked when this action is resuming after an external redirect. If your\n * onExecutePostLogin function does not perform a redirect, this function can be safely ignored.\n *\n * @param {Event} event - Details about the user and the context in which they are logging in.\n * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.\n */\nexports.onContinuePostLogin = async (event, api) => {\n  // Not needed for this action\n};",
    "runtime": "node18"
  }')
  
  echo "Action update response:"
  echo "${ACTION_RESPONSE}" | jq '.'
fi

# Deploy the action
echo "Deploying action..."
DEPLOY_RESPONSE=$(curl -X POST "https://${AUTH_AUTH0_MGMT_DOMAIN}/api/v2/actions/actions/${ACTION_ID}/deploy" \
-H "Authorization: Bearer ${TOKEN}" \
-H "Content-Type: application/json")

echo "Deploy response:"
echo "${DEPLOY_RESPONSE}" | jq '.'

# Wait for deployment to complete
echo "Waiting for deployment to complete..."
sleep 5

# Get the trigger ID for post-login
echo "Getting post-login trigger ID..."
TRIGGER_ID=$(curl -s -X GET "https://${AUTH_AUTH0_MGMT_DOMAIN}/api/v2/actions/triggers" \
-H "Authorization: Bearer ${TOKEN}" \
-H "Content-Type: application/json" | jq -r '.[] | select(.id == "post-login") | .id')

# Bind the action to the post-login trigger
echo "Binding action to post-login trigger..."
BINDING_RESPONSE=$(curl -X PATCH "https://${AUTH_AUTH0_MGMT_DOMAIN}/api/v2/actions/triggers/post-login/bindings" \
-H "Authorization: Bearer ${TOKEN}" \
-H "Content-Type: application/json" \
-d "{
  \"bindings\": [
    {
      \"ref\": {
        \"type\": \"action_id\",
        \"value\": \"${ACTION_ID}\"
      },
      \"display_name\": \"Add Google Photos Scopes\"
    }
  ]
}")

echo "Binding response:"
echo "${BINDING_RESPONSE}" | jq '.'
