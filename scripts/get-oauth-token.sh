#!/bin/bash

source ../.env

curl --request POST \
  --url ${AUTH_AUTH0_ISSUER}/oauth/token \
  --header 'content-type: application/json' \
  --data "{
    \"client_id\": \"${AUTH_AUTH0_MGMT_ID}\",
    \"client_secret\": \"${AUTH_AUTH0_MGMT_SECRET}\",
    \"audience\": \"${AUTH_AUTH0_ISSUER}/api/v2/\",
    \"grant_type\": \"client_credentials\"
  }"
