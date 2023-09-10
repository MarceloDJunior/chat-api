# Chat API

This is the backend for a chat application built with NestJS and TypeORM. It includes a gateway for WebSocket communication using Socket.IO and uses Auth0 with Passport for authentication. The backend is deployed to AWS Elastic Beanstalk.

You can access the live project at [chat-api.link](http://chat-api.link).

Frontend Repo: https://github.com/MarceloDJunior/chat-client

## Technologies Used

- NestJS: A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
- TypeORM: An ORM that can run in NodeJS and can be used with TypeScript and JavaScript. This project uses TypeORM migrations for database operations.
- Socket.IO: A JavaScript library for real-time web applications. It enables real-time, bidirectional and event-based communication.
- Auth0 & Passport: Used for handling user authentication.
- AWS Elastic Beanstalk: An orchestration service offered by Amazon Web Services for deploying applications.
- AWS CodePipeline & CodeBuild: Fully managed continuous delivery service that helps you automate your release pipelines.
- Node Version Manager (NVM): A version manager for Node.js, designed to be installed per-user and invoked per-shell.
- Docker Compose: Used to define and run multi-container Docker applications. In this project, it's used to create a PostgreSQL database image.

## Setup and Installation

To run this project, you will need to have NVM and Docker installed.

1. Clone the repository:

```bash
git clone https://github.com/MarceloDJunior/chat-api.git
```

2. Navigate to the project directory:

```bash
cd chat-api
```

3. Install the correct Node.js version using NVM:

```bash
nvm use
```

4. Install dependencies:

```bash
npm install
```

5. Create a `.env` file based on the provided `.env.example` and fill in your specific variables.

6. Start the PostgreSQL database using Docker Compose:

```bash
docker-compose up
```

7. Run the application:

```bash
npm run start
```

## Deployment

The backend is automatically deployed to AWS Elastic Beanstalk using AWS CodePipeline and CodeBuild. Any changes pushed to the main branch will trigger the pipeline, which will build the application and deploy it to Elastic Beanstalk.

A `Procfile` is included in the repository with the configuration needed to start the application from Elastic Beanstalk.

The build and deployment process is defined in the `buildspec.yaml` file, which is used by AWS CodeBuild. This file contains a set of build commands and related settings, in YAML format, that CodeBuild uses to run a build.

Please ensure that your AWS credentials are correctly set up and that the Elastic Beanstalk environment is properly configured.

## WebSocket Communication

This application uses Socket.IO for real-time, bidirectional and event-based communication. The Socket.IO gateway is set up to handle incoming messages and broadcast them to all connected clients.

## Authentication

User authentication is handled using Auth0 and Passport. Please refer to the Auth0 documentation for details on how to configure Auth0.
