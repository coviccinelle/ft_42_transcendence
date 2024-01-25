# 🎉🌸🦆**ft_transcendence** 🦢🐣🐤

Welcome to the last project in the Common Core of 42 (Paris).

![til](https://github.com/coviccinelle/42ft_transcendence/blob/master/visual/pong_canards.gif)

Note: Please note that this is the old version of this subject (2023). 

# Ping Pong Online Multiplayer Game Project

## Table of Contents
1. [Overview](#overview)
   - [Project Description](#project-description)
   - [Technical Requirements](#technical-requirements)
2. [Security Concerns](#security-concerns)
3. [User Account](#user-account)
4. [Chat](#chat)
5. [Game](#game)

## Overview

### _Project Description_
Welcome to the final mandatory project - the Ping Pong Online Multiplayer Game! In this project, you will be creating a website that allows users to engage in real-time multiplayer Pong matches. The project encompasses the development of a user-friendly interface, an integrated chat system, and a seamless online gaming experience.

### _Technical Requirements_
To ensure uniformity and adherence to standards, the project has set the following technical requirements:
- Backend development using NestJS.
- Frontend development using a TypeScript framework of your choice.
- PostgreSQL database usage exclusively.
- Single-page application structure for smooth navigation.
- Compatibility with the latest version of Google Chrome and an additional web browser.
- Error-free user experience with no unhandled errors or warnings.
- Deployment using a single call: `docker-compose up --build`.

## Security Concerns

To create a secure and fully functional website, you must address the following security concerns:
- Passwords stored in the database must be hashed.
- Protection against SQL injections.
- Implementation of server-side validation for forms and user input.
- Usage of a strong password hashing algorithm.
- Local storage of credentials, API keys, and environment variables in a `.env` file, excluded from version control.

## User Account

### _User Authentication_
- OAuth login system through the 42 intranet.
- User selection of a unique display name and avatar upload capability.
- Two-factor authentication options, such as Google Authenticator or phone-based methods.
- Ability to add friends, view their status, display user statistics, and match history.

## Chat

### _Chat Features_
- Creation of public, private, or password-protected channels.
- Direct messaging capabilities.
- User blocking functionality.
- Channel owner privileges, including setting passwords, changing them, and managing users.
- Invitation to Pong games and access to player profiles through the chat interface.

## Game

### _Pong Game_
- Live Pong gameplay versus other users on the website.
- Matchmaking system allowing users to join a queue and get automatically matched.
- Customization options, including power-ups or different maps.
- Responsive design considering network issues like unexpected disconnections or lag.

**Important Note:** The primary goal is to provide the best possible user experience throughout the entire website.

Now, let's roll up our sleeves and embark on this exciting journey of creating an immersive and entertaining Ping Pong Online Multiplayer Game!
