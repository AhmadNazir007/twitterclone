# Twitter Clone Frontend

This is a Next.js 15 frontend for a Twitter/X-style app. It includes authentication screens, a protected home feed, post CRUD actions, likes, comments, a profile view, admin category creation, and Socket.IO notification handling.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from the example:

```bash
cp .env.example .env.local
```

3. Set the backend URL:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

4. Start the dev server:

```bash
npm run dev
```

## Expected Backend Endpoints

The frontend expects these API routes to exist on `NEXT_PUBLIC_API_URL`:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /posts`
- `POST /posts`
- `PUT /posts/:id`
- `DELETE /posts/:id`
- `POST /posts/:id/like`
- `POST /posts/:id/comments`
- `POST /category/create`

The login response should include:

```json
{
  "access_token": "jwt-token",
  "user": {
    "id": "user-id",
    "username": "username",
    "role": "user"
  }
}
```

## Current Coverage

Implemented in this frontend:

- Auth forms with validation.
- Redux auth state with localStorage hydration.
- Protected app shell with public login/register routes.
- Post create, read, update, delete actions.
- Like toggling and comment creation.
- Basic owner-only edit/delete controls.
- Static right sidebar content and basic profile display.
- Admin category creation form.
- Socket.IO notification toast handling.

Still backend-dependent:

- Real user/profile editing.
- Real search, follow, messages, bookmarks, notifications pages, and retweets.
- Server-side authorization for post/category actions.
- Production-grade media upload support.
