## Users by Page Backend Server

> This project has no production goal; some features are missing or stubbed.

This is a test project aimed mostly at demonstrating skills in backend service development, code style, and system design. It implements a primitive system for creating, storing, and reading users of the system. 

It lacks functionality such as updating and deleting users, authorization, and access control strategies. Also it has no testing for now.<br>However, it is not a production-ready project. It has its functionality and works stably and robustly.

### Entry Points

The project has two entry points:

- **main.ts**: Entry point for starting the service.
- **seed.ts**: Utility entry point to seed initial test data to the database.

> Note: CORS is enabled for all sources to allow testing from various sources. In production, the CORS settings should be updated.

## Modules

### Users

The most important module, which handles the logic for creating and reading user data. It provides features for creating users and reading both single users and pages of users. Creating a user requires a token for access.

- **Libraries**:
  - `nestjs/typeorm` and `nestjs/typeorm-paginate` for database interaction.
  - `express.Multer` for file handling.
  - `class-validator` and `class-transformer` for data validation and transformation.

Users can be seeded using the [Seed module](#seed) with generated data.

### Positions

This module manages the list of positions. Positions are relatively static, so it provides a single endpoint for reading the list of positions and uses caching to reduce database calls.

- **Libraries**:
  - `nestjs/typeorm` for database interaction.

Positions can be added manually to the database or seeded using the [Seed module](#seed).

### Photo

This module encapsulates the logic for processing and storing images. It provides a single endpoint for reading an image by filename. Images are saved by the [Users module](#users) in a transaction to ensure data integrity.

- **Libraries**:
  - `nestjs/typeorm` for database interaction.
  - `sharp` for image metadata validation.
  - `tinify` for image processing via the `tinypng.com` service.

### Token

This module contains the logic for working with access tokens. It provides one-time tokens with a short TTL that can be used for creating users.

> Note: For simplicity, acquiring a token doesn't require any other actions now. In production, proper authorization should be implemented.

- **Libraries**:
  - `redis` for token storage and invalidation.

### Database

A utility module that establishes a connection with the PostgreSQL database using TypeORM.

### Seed

This module is used for seeding the database with test data. It has a separate [entry point](#entry-points) for seeding and also an endpoint for seeding, protected by a secure key.

- **Libraries**:
  - `faker` for generating realistic fake personal data.

## Deployment

This service is deployed on Render with Docker containers, using a multi-stage build to significantly reduce the size of the resulting image.

A small one-page frontend application is also deployed to demonstrate how the backend service works.

> Note: Both the backend and frontend services are on a free tier, so the instances will spin down with inactivity, which can delay requests by up to 50 seconds during the first access.

Links:
- [Backend service](https://usersbypage-service.onrender.com)
- [Frontend service](https://test-users-by-page-front.onrender.com)
