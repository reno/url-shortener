FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies needed for node-gyp if any (alpine)
# RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

COPY . .

# Build the TypeScript files to JS
RUN npm run build

# --- Production Image ---
FROM node:20-alpine AS production

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev

# Copy compiled files from the builder stage
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist

ENV NODE_ENV=production
ENV PORT=3333

EXPOSE 3333

USER node

CMD ["npm", "run", "start"]
