## build runner
FROM node:lts-alpine as build-runner

# Set temp directory
WORKDIR /tmp/app

# Move package.json
COPY package.json .
COPY .env .

COPY tsconfig.build.json .
COPY tsconfig.json .

# Install dependencies
RUN npm install

# Move source files
COPY src ./src
COPY tsconfig.json   .

# Build project
RUN npm run build

## producation runner
FROM node:lts-alpine as prod-runner

# Set work directory
WORKDIR /app

# Copy package.json from build-runner
COPY --from=build-runner /tmp/app/package.json /app/package.json
COPY --from=build-runner /tmp/app/tsconfig.build.json /app/tsconfig.build.json
COPY --from=build-runner /tmp/app/tsconfig.json /app/tsconfig.json
ADD src dist
ADD dist app/dist
ADD src app/src


# Install dependencies
RUN npm install --only=production

# Start bot
CMD [ "npm", "start" ]
