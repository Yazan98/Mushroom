## build runner
FROM node:lts-alpine3.16 as build-runner

# Set temp directory
WORKDIR /tmp/app
WORKDIR /usr/src/app

# Move package.json
COPY package.json .
COPY .env .

COPY tsconfig.build.json .
COPY tsconfig.json .

RUN npm i -g npm

# Install dependencies
RUN npm install
RUN npm install --only=development

# Move source files
COPY src ./src
COPY tsconfig.json   .

# Build project
RUN npm run build

## producation runner
FROM node:lts-alpine as prod-runner
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set work directory
WORKDIR /app
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install --only=production
COPY --from=development /usr/src/app/dist ./dist

# Copy package.json from build-runner
COPY --from=build-runner /tmp/app/package.json /app/package.json
COPY --from=build-runner /tmp/app/tsconfig.build.json /app/tsconfig.build.json
COPY --from=build-runner /tmp/app/tsconfig.json /app/tsconfig.json
ADD src dist
ADD dist app/dist
ADD src app/src


# Install dependencies
RUN npm install
COPY . .
EXPOSE 3000

# Start bot
CMD ["node", "dist/main"]
