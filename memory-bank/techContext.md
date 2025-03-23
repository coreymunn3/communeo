# Technical Context: Communeo

## Technology Stack

Communeo is built using a modern web technology stack:

### Frontend

- **Next.js 14**: React framework with App Router for server components and routing
- **React 18**: UI library for component-based development
- **TypeScript**: For type-safe code and improved developer experience
- **TailwindCSS**: Utility-first CSS framework for styling
- **ShadCN UI**: Component library built on Radix UI primitives
- **Radix UI**: Unstyled, accessible component primitives
- **Lucide React**: Icon library
- **TanStack React Query**: Data fetching, caching, and state management
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation for forms and API requests
- **next-themes**: Theme management for dark/light mode

### Backend

- **Next.js API Routes**: Backend API endpoints
- **Next.js Server Actions**: Server-side data mutations
- **Prisma ORM**: Database access and schema management
- **PostgreSQL**: Relational database
- **Clerk**: Authentication and user management
- **Puppeteer**: For link preview generation
- **Cheerio**: HTML parsing for link previews

### Development Tools

- **ESLint**: Code linting
- **TypeScript**: Static type checking
- **npm**: Package management
- **dotenv-cli**: Environment variable management
- **TanStack Query DevTools**: Debugging tools for React Query

## Development Environment

### Prerequisites

- Node.js (v18+)
- npm or yarn
- PostgreSQL database
- Clerk account for authentication

### Environment Variables

The application requires the following environment variables:

```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/communeo"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3002
```

### Development Workflow

1. **Local Development**:

   ```bash
   npm run dev
   ```

   This starts the development server on port 3002.

2. **Database Migrations**:

   ```bash
   npm run migrate:dev
   ```

   This applies Prisma migrations to the development database.

3. **Prisma Client Generation**:

   ```bash
   npm run prisma:generate
   ```

   This generates the Prisma client based on the schema.

4. **Building for Production**:

   ```bash
   npm run build
   ```

   This creates an optimized production build.

5. **Starting Production Server**:
   ```bash
   npm run start
   ```
   This starts the production server on port 3002.

## Database Schema

The database uses PostgreSQL with Prisma ORM. Key models include:

- **app_user**: User accounts linked to Clerk authentication
- **community**: Forums/communities with their own rules and members
- **post**: Content created by users (text, image, or link types)
- **comment**: Responses to posts, with support for nested replies
- **vote**: Upvotes/downvotes on posts and comments
- **community_member**: Tracks community memberships
- **flair**: Tags for categorizing posts within communities

## Authentication

Authentication is handled by Clerk, which provides:

- User registration and login
- Social login options
- Session management
- User profile management
- Webhooks for user events

The application syncs Clerk user data to the local database for relational queries.

## API Structure

The API follows RESTful principles with endpoints organized by resource:

- `/api/community`: Community management
- `/api/post`: Post creation and retrieval
- `/api/comment`: Comment operations
- `/api/user`: User profile operations
- `/api/link-preview`: Link preview generation
- `/api/webhooks`: Webhook handlers for external services

## Deployment Considerations

- The application is designed to be deployed on platforms like Vercel
- PostgreSQL database should be hosted on a reliable provider
- Environment variables must be properly configured in the production environment
- Clerk webhooks need to be set up to point to the production webhook endpoint

## Performance Considerations

- Server Components are used for initial rendering and SEO
- Client Components are used for interactive elements
- TanStack Query provides efficient data fetching and caching
- Images should be optimized and served through a CDN
- Database queries are optimized with appropriate indexes

## Security Considerations

- Authentication is handled by Clerk, a secure third-party service
- Server Actions and API routes validate input using Zod schemas
- Database access is restricted through Prisma's type-safe queries
- Environment variables are used for sensitive configuration
- CSRF protection is provided by Next.js

This technical context provides a comprehensive overview of the technologies, tools, and patterns used in Communeo.
