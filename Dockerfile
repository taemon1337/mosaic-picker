FROM node:20-slim

WORKDIR /app

# Install yarn
RUN corepack enable

COPY package.json yarn.lock* ./

RUN yarn install

COPY . .

EXPOSE 5173

CMD ["yarn", "dev"]
