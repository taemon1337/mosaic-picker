#!/bin/sh
corepack enable
yarn create svelte . --template skeleton --typescript --prettier --eslint --no-git
yarn install
