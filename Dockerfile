FROM node:20-alpine AS base

# Builder stage
FROM base AS builder
# Set working directory
WORKDIR /app
RUN npm install -g turbo
COPY . .

# Pass APP_NAME as a build arg (defaults to api)
ARG APP_NAME=api
RUN turbo prune @sellzy/${APP_NAME} --docker

# Installer stage
FROM base AS installer
WORKDIR /app

# Ensure we do not run in production mode during install so devDependencies are kept for workspace linking
ENV NODE_ENV=development

# Copy the pruned lockfile and package.json files
COPY --from=builder /app/out/json/ .
RUN npm install

# Build the project
COPY --from=builder /app/out/full/ .
ARG APP_NAME=api
RUN npx turbo run build --filter=@sellzy/${APP_NAME}

# Final runner stage (Optional, but good for reducing image size)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ARG APP_NAME=api
ENV APP_NAME=${APP_NAME}

# Copy the built app
COPY --from=installer /app .

EXPOSE 4000
EXPOSE 3000

CMD ["sh", "-c", "npm run start --workspace=@sellzy/${APP_NAME}"]
