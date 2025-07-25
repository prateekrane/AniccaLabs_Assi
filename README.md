# Anicca Labs App

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <your-repo-folder>
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Configure Supabase:**
   - Update `supabase.js` with your Supabase project URL and anon key.
   - Ensure your Supabase tables match the schema below.
4. **Run the app:**
   ```bash
   npx expo start
   # or
   expo start
   ```
5. **Assets:**
   - Place your logo and icons in the `assets/` folder as needed.

---

## Database Schema Overview

- **Users**: `{ id, username, email, created_at }`
- **Posts**: `{ id, title, description, image_urls, author_id, created_at }`
- **Tags**: `{ id, name }`
- **Post_tags**: `{ post_id, tag_id }` (many-to-many for post-tag relationship)
- **Post_upvotes**: `{ post_id, user_id }` (for bookmarks/upvotes)

### Personalization Logic
- Users select up to 5 tags of interest.
- The "Interested Posts" feed shows posts matching any selected tags.
- "Your Feeds" shows posts authored by the logged-in user.
- Bookmarked posts are stored in `Post_upvotes` and shown in the profile.
- All tag and post queries join with the Users table to display usernames.

---

## Scaling to 1 Million Users in India: Priorities & Redesign

- **Optimize Database Indexing:**
  - Add indexes on `author_id`, `tag_id`, and `user_id` fields for fast queries.
- **Move to Serverless Functions for Personalization:**
  - Offload heavy personalization logic (e.g., tag-based recommendations) to serverless functions or microservices.
- **Use a CDN for Images:**
  - Store and serve images via a CDN (e.g., AWS S3 + CloudFront) to reduce latency and bandwidth costs.
- **Implement Caching:**
  - Use Redis or similar for caching popular feeds and tag queries to reduce database load.
- **Prioritize Mobile Performance:**
  - Optimize image sizes, use lazy loading, and minimize bundle size for low-end devices and slow networks common in India.

---


