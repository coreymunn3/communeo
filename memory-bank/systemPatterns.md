# System Patterns: Communeo

## Architecture Overview

Communeo is built using a modern web application architecture with the following key components:

1. **Next.js App Router**: The application uses Next.js with the App Router pattern, leveraging both server and client components for optimal performance and SEO.

2. **Server Components**: Used for data fetching and initial rendering to improve performance and reduce client-side JavaScript.

3. **Server Actions**: Implemented for form submissions and data mutations, providing a secure way to interact with the database.

4. **API Routes**: Used for client-side data fetching and external integrations.

5. **PostgreSQL Database**: Stores all application data with a well-structured relational schema.

6. **Prisma ORM**: Provides type-safe database access and schema management.

7. **Clerk Authentication**: Handles user authentication, session management, and user profiles.

## Database Design

The database schema is designed around the following core entities:

1. **app_user**: Represents a user in the system, linked to Clerk authentication.

2. **community**: Represents a community/forum with its own rules, moderators, and members.

3. **post**: Content created by users within communities, with different types (text, image, link).

4. **comment**: Responses to posts, which can be nested for threaded discussions.

5. **vote**: Represents upvotes/downvotes on posts and comments.

6. **community_member**: Junction table tracking community memberships.

7. **flair**: Tags that can be applied to posts for categorization within communities.

Key relationships include:

- Users can create multiple communities, posts, and comments
- Communities contain multiple posts
- Posts contain multiple comments
- Comments can have parent-child relationships for threading
- Votes are linked to either posts or comments and to the user who voted

## Component Structure

The application follows a component-based architecture using React:

1. **Layout Components**: Define the overall structure of pages (Header, PageLayoutContainer).

2. **Feature Components**: Implement specific features (Posts, Comments, CreateCommunity, UserActivity, UserDashboard).

3. **UI Components**: Reusable UI elements from ShadCN/Radix UI (Button, Dialog, Form, Chart).

4. **Provider Components**: Manage global state and context (ThemeProvider, AppContext).

5. **Dashboard Components**: Specialized components for displaying user statistics and activity (CommunityScoreChart, CommunityTab).

## State Management

State management is handled through a combination of:

1. **React Context**: For global UI state (AppContext manages dialog open/close states).

2. **TanStack Query**: For server state management, data fetching, caching, and synchronization.

3. **React useState/useReducer**: For local component state.

4. **Server Components**: For initial state that doesn't need client-side interactivity.

## Authentication Flow

1. **Clerk Integration**: Handles user registration, login, and session management.

2. **Middleware**: Protects routes that require authentication.

3. **Database Sync**: New Clerk users are synchronized to the app_user table.

4. **Auth Context**: User authentication state is available throughout the application.

## Data Fetching Patterns

1. **Server Components**: Direct database access for initial page load.

2. **TanStack Query**: Client-side data fetching with caching and revalidation.

3. **API Routes**: Endpoints for client-side data operations.

4. **Server Actions**: For form submissions and data mutations.

5. **Search Queries**: Case-insensitive database queries with pagination for search functionality.

6. **Dashboard Queries**: Specialized API endpoints for user dashboard data:
   - `/api/user/[username]/dashboard/scores` - User score metrics
   - `/api/user/[username]/dashboard/posts` - Post activity metrics
   - `/api/user/[username]/dashboard/comments` - Comment activity metrics
   - `/api/user/[username]/dashboard/communities` - Community activity and membership data

## Routing Structure

The application uses Next.js App Router with the following route structure:

- `/` - Home page with feed of posts
- `/c/[slug]` - Community page
- `/c/[slug]/post/[postId]` - Individual post page
- `/u/[username]` - User profile page with activity and dashboard
- `/search` - Search results page with support for query parameters:
  - `q` - Search term
  - `community` - Community slug for scoped search
  - `username` - Username for user-specific search
- `/api/*` - API endpoints

## Error Handling

1. **Try/Catch Blocks**: Used in server actions and API routes.

2. **Error Boundaries**: For client-side error containment.

3. **Toast Notifications**: For user-friendly error messages.

## Responsive Design

The application is fully responsive with:

1. **Mobile-First Approach**: Base styles are for mobile with breakpoints for larger screens.

2. **Conditional Rendering**: Different components or layouts based on screen size.

3. **Flexible Layouts**: Using Flexbox and Grid for adaptive layouts.

## Theme Support

1. **Dark/Light Mode**: Implemented using next-themes.

2. **Consistent Design System**: Using TailwindCSS with a consistent color palette and spacing.

These system patterns provide a foundation for understanding the technical architecture and design decisions in Communeo.
