# SchoolERP – School Management System

SchoolERP is a web-based school management application designed to help schools manage their daily academic and administrative activities from one place.

The project uses a modern frontend and backend architecture with a REST API and a PostgreSQL database.

## Features

The application is designed to support the following school operations (availability depends on the modules implemented in the source code):

- Student and admission management
- Teacher and staff management
- Class and academic information management
- Manual student and teacher attendance
- Fees and payment management
- Examinations, marks, and results
- Reports and printable documents
- Authentication and role-based access

### Attendance workflow

The current requested attendance workflow is manual:

- Record attendance as **Present** or **Absent**.
- Do not use face recognition, biometric, or mobile attendance workflows.
- Use the simple UI label **Attendance**.
- Support date-based or date-range attendance reports where the API provides the required data.

## Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Redux Toolkit Query
- Tailwind CSS
- Lucide React

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL / Supabase
- REST API

### Tools and services

- Git and GitHub
- Postman
- Vercel (deployment, where configured)
- Cloudinary (file/media storage, where configured)

## Project Structure

```text
SchoolERP/
├── README.md
├── HowToSetup.md
├── .env.example
├── LICENSE-NOTE.md
├── CHANGELOG.md
├── CLAUDE.md
├── Node Project/
│   ├── School_management_frontend/
│   └── School_management_backend/
├── database/
│   ├── schema.sql
│   └── seed.sql
└── docs/
    └── API-REFERENCE.md
```

> Add the complete frontend and backend source code to their respective folders. The documentation scaffold alone is not a runnable application.

## Requirements

Install the following before running the project:

- Node.js (use a version compatible with the project's `package.json`)
- npm
- PostgreSQL or a Supabase PostgreSQL project
- Git
- Visual Studio Code or another code editor

## Installation and Setup

### 1. Get the project source

Clone or download the SchoolERP project, then make sure the frontend and backend source code are present in:

```text
Node Project/School_management_frontend/
Node Project/School_management_backend/
```

### 2. Configure the backend

Open a terminal:

```bash
cd "Node Project/School_management_backend"
npm install
```

Create a `.env` file in the backend directory and configure the required database, authentication, and service variables. Use the root `.env.example` as a checklist, then verify the exact variable names used by the backend source code.

Generate the Prisma client:

```bash
npx prisma generate
```

Apply existing migrations using the workflow supported by the Prisma version in the project. For a deployed environment, this is commonly:

```bash
npx prisma migrate deploy
```

Do not run destructive database reset commands against production data.

Start the backend using the script defined in `package.json`. A typical development command is:

```bash
npm run dev
```

### 3. Configure the frontend

Open another terminal:

```bash
cd "Node Project/School_management_frontend"
npm install
```

Create `.env.local` in the frontend directory and set the API URL. For local development, the project may use:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

Confirm the exact environment variable name in the frontend source code.

Start the frontend using the script defined in `package.json`. A typical command is:

```bash
npm run dev
```

Open the local URL printed by Next.js, commonly:

```text
http://localhost:3000
```

For detailed instructions, see [HowToSetup.md](HowToSetup.md).

## Environment Variables

Never commit real secrets or `.env` files.

Typical configuration includes:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Frontend API base URL |
| `PORT` | Backend server port |
| `DATABASE_URL` | PostgreSQL connection string |
| `DIRECT_URL` | Direct PostgreSQL connection, if required by Prisma |
| `JWT_SECRET` | Backend token signing secret |
| `CLIENT_URL` | Allowed frontend origin |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name, if used |
| `CLOUDINARY_API_KEY` | Cloudinary API key, if used |
| `CLOUDINARY_API_SECRET` | Cloudinary secret, if used |

These are common examples, not a guarantee of the exact variables required by your code. Check the frontend and backend source before deployment.

## API

The backend REST API uses the `/api/v1` prefix in the current project setup.

Example local base URL:

```text
http://localhost:5000/api/v1
```

For exact endpoints, request parameters, and payloads, see [docs/API-REFERENCE.md](docs/API-REFERENCE.md). Always verify endpoint contracts against the actual backend routes, controllers, services, and validation schemas.

## Database

The backend Prisma schema and migration history are the source of truth for the database structure.

- Review the Prisma schema before changing database models.
- Keep migrations under version control.
- Generate the Prisma client after schema changes.
- Back up production data before applying migrations.
- Do not store real student, teacher, or guardian data in sample SQL files.

The `database/schema.sql` and `database/seed.sql` files in this package are starter documentation files. Replace or populate them only after verifying the actual schema and seed requirements.

## Deployment

The frontend and backend can be deployed separately.

Before deploying:

1. Configure production environment variables in the hosting platforms.
2. Set the frontend API URL to the deployed backend.
3. Add the exact frontend origin to the backend CORS allowlist.
4. Use HTTPS for production endpoints.
5. Configure the production PostgreSQL connection and pooling as required.
6. Apply database migrations before deploying code that depends on them.
7. Confirm authentication, file uploads, and all required API routes in production.

## Development Guidelines

- Follow the existing project structure and coding conventions.
- Use TypeScript types for API requests and responses.
- Preserve existing API routes and Redux Toolkit Query behavior unless a change is required.
- Validate user input on the backend.
- Handle loading, empty, success, and error states in the UI.
- Keep secrets out of source control.
- Test changes before deployment.
- Update the changelog and API reference when behavior or endpoints change.

## Documentation

- [Setup Guide](HowToSetup.md)
- [API Reference](docs/API-REFERENCE.md)
- [Changelog](CHANGELOG.md)
- [AI Development Guide](CLAUDE.md)
- [License Note](LICENSE-NOTE.md)

## License

Review `LICENSE-NOTE.md` and the licenses of all third-party dependencies, templates, assets, and starter code before redistributing this project. Add the applicable project license only when you have the right to do so.

---

**SchoolERP** – School management made easier.
