FROM node:14-alpine as build-runner

# Set necessary environment variables.
ENV NODE_ENV=production \
    NPM_CONFIG_PREFIX=/home/node/.npm-global \
    PATH=$PATH:/home/node/.npm-global/bin:/home/node/node_modules/.bin:$PATH

# For handling Kernel signals properly
RUN apk add --no-cache tini

# Create the working directory, including the node_modules folder for the sake of assigning ownership in the next command
RUN mkdir -p /usr/src/app/node_modules

# Change ownership of the working directory to the node:node user:group
# This ensures that npm install can be executed successfully with the correct permissions
RUN chown -R node:node /usr/src/app

# Set the user to use when running this image
# Non previlage mode for better security (this user comes with official NodeJS image).
USER node

# Set the default working directory for the app
# It is a best practice to use the /usr/src/app directory
WORKDIR /usr/src/app

COPY package.json .
COPY .env .

COPY tsconfig.build.json .
COPY tsconfig.json .

RUN npm i -g npm

# Install dependencies
RUN npm install

# Move source files
COPY src ./src
COPY tsconfig.json   .

COPY --from=build-runner /tmp/app/package.json /usr/src/app/package.json
COPY --from=build-runner /tmp/app/tsconfig.build.json /usr/src/app/tsconfig.build.json
COPY --from=build-runner /tmp/app/tsconfig.json /usr/src/app/tsconfig.json
ADD src dist
ADD dist /usr/src/app/dist
ADD src /usr/src/app/src

# Copy package.json, package-lock.json
# Copying this separately prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./

# Install dependencies.
RUN npm i -g @nestjs/cli
RUN npm install

# Necessary to run before adding application code to leverage Docker cache
RUN npm cache clean --force
# RUN mv node_modules ../

# Bundle app source
COPY --chown=node:node . ./

# Display directory structure
RUN ls -l

# Expose API port
EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--"]

# Run the web service on container startup
CMD [ "npm", "start" ]