# MultipliChurch

This is the code for the MultipliChurch project.

## Requirements

- Git - [Download](https://git-scm.com/install/)
- Node.js - [Download](https://nodejs.org/en/download)
- Postman - [Download](https://www.postman.com/downloads/)

## Installation

1. Clone the GitHub repository:

   ```bash
   git clone https://github.com/David4bay/MultipliChurch-api.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

## API Routes

### Authentication Routes

| Method | Endpoint   | Description          | Authentication |
|--------|------------|----------------------|----------------|
| POST   | `/login`   | User login           | None           |
| POST   | `/signup`  | User registration    | None           |

### Church Routes

| Method | Endpoint       | Description              | Authentication |
|--------|----------------|--------------------------|----------------|
| GET    | `/churches`   | Get all churches         | JWT (User)     |
| GET    | `/churches/:id` | Get church by ID         | JWT (User)     |
| PUT    | `/churches/:id` | Update church by ID      | JWT (Admin)    |
| POST   | `/churches`    | Create new church        | JWT (Admin)    |
| DELETE | `/churches/:id` | Delete church by ID      | JWT (Admin)    |

### Member Routes

| Method | Endpoint                          | Description                  | Authentication |
|--------|-----------------------------------|------------------------------|----------------|
| GET    | `/churches/:churchId/members`     | Get all members of a church  | JWT (User)     |
| GET    | `/churches/:churchId/members/:id` | Get member by ID             | JWT (User)     |
| PUT    | `/churches/:churchId/members/:id` | Update member by ID          | JWT (Admin)    |
| POST   | `/churches/:churchId/members`     | Add new member to church     | JWT (Admin)    |
| DELETE | `/churches/:churchId/members/:id` | Delete member by ID          | JWT (Admin)    |
