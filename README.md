# Real-Time Chat Backend

This is a real-time chat backend built with Node.js and Socket.IO.
It supports:
- Multiple chat rooms
- Real-time messaging
- User join/leave notifications

## Installation

```
npm install
```

## Run Server

```
npm start
```

## API

Socket.IO events:
- `joinRoom({ room, username })`
- `sendMessage(message)`
- `receiveMessage({ user, message })`
- `userList`

Developed for CodTech Internship Task-2.