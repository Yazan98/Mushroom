<p align="center">
  <a href="http://github.com/Yazan98/Mushroom" target="blank"><img src="https://github.com/Yazan98/Mushroom/blob/main/images/logo.png?raw=true" width="200" alt="Bot Logo" /></a>
</p>

# Mushroom Bot

[![Docker Image CI](https://github.com/Yazan98/Mushroom/actions/workflows/docker-image.yml/badge.svg?branch=main)](https://github.com/Yazan98/Mushroom/actions/workflows/docker-image.yml)
![](https://img.shields.io/badge/Language-Typescript-blue)
![](https://img.shields.io/badge/Version-1.0.0-green)
![](https://img.shields.io/badge/Docker%20Image-Supported-orange)
![](https://img.shields.io/badge/Github%20Api-Supported-lightgrey)
![](https://img.shields.io/badge/Discord%20Server-Supported-yellowgreen)

![](https://github.com/Yazan98/Mushroom/blob/main/images/Screenshot%202022-08-06%20095727.png?raw=true)

## Screenshots
1. [Get Account Information](https://github.com/Yazan98/Mushroom/blob/main/images/Screenshot%202022-08-06%20095727.png?raw=true)
2. [Get Account Repositories Information](https://github.com/Yazan98/Mushroom/blob/main/images/Screenshot%202022-08-06%20095838.png?raw=true)
3. [Get Repository Information](https://github.com/Yazan98/Mushroom/blob/main/images/Screenshot%202022-08-06%20095920.png?raw=true)
4. [Help Message](https://github.com/Yazan98/Mushroom/blob/main/images/Screenshot%202022-08-06%20100021.png?raw=true)
5. [Add New Library](https://github.com/Yazan98/Mushroom/blob/main/images/Screenshot%202022-08-06%20100113.png?raw=true)
6. [Cron Job Libraries](https://github.com/Yazan98/Mushroom/blob/main/images/Screenshot%202022-08-06%20100314.png?raw=true)

## Description
While Im Tracking Specific Repositories i need to go to each Repository and Check them or Twitter or Github Feed to See whats New in specific Repositories so i need to go to Many places to see the news but rather than going to all of them why not to build a cron job to run every day to check all of them in github releases and once a new release submitted in github release discord bot will send a message with it

## Technologies Used
1. Discord Server
2. Discord Bot
3. NestJs Framework
4. Eslint
5. Typescript
6. Docker Image Configuration

## Setup

Before You Start Make Sure to Add All Libraries to json Files to let Mushroom Track All of them in Libraries Folder You Will See More Than Json File add The Required Libraries in these Json Files

The Following Steps is Required to Configure The Project
1. Add Your Secrete Keys to ApplicationKeysManager Class (Github Username, Github Token, Discord Token)
2. Add Your Discord Channels in channels.json inside Libraries Folder (Names Should not be Changed)
3. When Build Docker Image Change isLocalEnv inside ApplicationKeysManager to False to Change the Directory to Docker Image Path
4. Execute npm run build in Terminal to Generate Production Code
4. Build Docker Image By Creating Docker Hub Account Then Create A Repository to Upload to

```
    docker build . --file Dockerfile --tag account/repository:latest
    docker push account/repository:latest
```

5. Open Virtual Machine With Docker Installed
6. Install and Run The Docker Image

```
    docker pull account/repository
    docker run account/repository
```

7. After Push You Will see The Bot is Online and Waiting for a Command or When Cron Job Callback Called


## License

Copyright (C) 2022 Mushroom is An Open Source Project (Licensed under the Apache License, Version 2.0)







