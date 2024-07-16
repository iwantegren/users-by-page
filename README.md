## Users by page backend server

> This project has no production goal, some of the features are missing or stubbed

This is a test project, aimed mostly on showing skills in development backend services, code style and system design.<br>
It implements a primitive system of creating, storing and reading users of the system.<br>
<br>
It lacks a lot of functionality such as updating and deleting, authorization and access control strategies, but again, it's not a production ready project.<br>
It has it's functionlaty and it works stable and robust.

### Entry points

The project has two entry points:

- main.ts: entry point for starting the service
- seed.ts: utilitary entry point to seed test data to the database

> For this service CORS enabled for all sources to provide access for testing from various sources
>
> In production CORS setting should be updated

## Modules

### users

The most important module, that has logic of creating and reading user data.<br>
Provides features for creating user and reading both single user and page of users.<br>
Creating user requires token for access.

Users can be seeded with [seed module](#seed) using generated data.

Uses `nestjs/typeorm` and `nestjs/typeorm-paginate` libs to connect and manipulate data in PostgreSQL.

Uses `express.Multer` to handle file handling

Uses `class-validator` and `class-transformer` to validate and manipulate incoming data

### positions

Small module that handles list of positions.<br>
Positions doesn't expect a lot of changes, so it provides single endpoint for reading list of positions.<br>
Uses caching to reduce calls to DB.

Positions either could be added manually to DB or seeded with [seed module](#seed) using predefined values.

Uses `nestjs/typeorm` lib to connect and manipulate data in PostgreSQL.

### photo

Module incapsulates logic for processing and storing images.<br>
Provides single endpoint for reading single image using filename.<br>
Images are saved by [users module](#users) in a transaction to ensure data integrity.<br>

Uses `nestjs/typeorm` lib to connect and manipulate data in PostgreSQL.

Uses `sharp` to reach metadata for image validation.

Uses `tinify` lib to communicate with `tinypng.com` service for image processing.

### token

Module that containg logic of working with access tokens.<br>
Provides one-time token with short TTL that could be used for creating user.<br>
> For simplicity acquiring of a token doesn't require any other actions now
>
> In production authorization should be implemented.

Uses `redis` to ensure token storage and invalidation.

### database

Utilitary module that has the only purpose is to estabilish connection with PostgreSQL database using TypeORM in a single place.

### seed

Module that is used for seeding database with testing data.<br>
Has separate [entry point](#entry-points) for seeding and also endpoint for seeding, protected by secure key.

Uses `faker` library for generating realistic fake personal data.
All generated users will have the same standard image.

## Deployment

This service is deployed on Render with Docker container.<br>
It uses multi-stage build to significantly reduce size of resulting image.

Also I've created and deployed small one-page frontend application just to demonstrate how the backend service works.

> Both the backend and frontend services are on a free tier, so the instances will spin down with inactivity<br>
> which can delay requests by 50 seconds or more during the first access to a service. 

Links:
- [Backend service](https://usersbypage-service.onrender.com)
- [Frontend service](https://test-users-by-page-front.onrender.com)