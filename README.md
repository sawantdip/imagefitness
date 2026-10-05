# Image Fitness

MERN gym portfolio for Image Fitness, Bhandup (West), Mumbai. React customer website and no-code admin panel, Express API, MongoDB Atlas and GridFS photo storage. Configured for a Render Static Site frontend with a real content/photo snapshot and the existing Web Service backend through an API rewrite. Combined hosting remains supported during migration.

## Project structure

```text
client/
  src/
    components/
      layout/       # Header and footer
      sections/     # Hero, training, trainers, equipment, reviews, contact
      admin/        # Reusable content form fields
    pages/          # Customer website and lazy-loaded admin
    services/       # API client
server/
  src/
    config/         # Environment and cached database connection
    controllers/    # Content, login, enquiry and photo operations
    middleware/     # Admin auth, origin checks, persistent rate limiting
    models/         # MongoDB collections
    routes/         # Express API routes
    validation/     # Request schemas
  tests/            # Security and MongoDB integration tests
api/index.js        # Vercel function adapter
render.yaml         # Existing backend plus static frontend configuration
vercel.json         # Legacy Vercel configuration (unused on Render)
```

## Local setup

1. Use Node.js 22.x and run `npm ci` from the repository root.
2. Copy `.env.example` to `.env` and set a real MongoDB URI, admin credentials, JWT secret and `APP_ORIGIN=http://localhost:5173`.
3. Run `npm run dev`.
4. Open http://localhost:5173 and http://localhost:5173/admin.

MongoDB is required. The earlier demo login and local JSON fallback have been removed. Database contents are seeded as sample website content on first read; Save changes persists the content in MongoDB.

If Atlas credentials are not ready, `npm run dev:local` explicitly starts a local development MongoDB alongside the client. It uses the admin credentials from `.env` and stores development data in `.npm-cache/local-development-db`. It does not connect to Atlas; the first run downloads a MongoDB binary. Stop any existing development servers before running this command. Use `npm run dev` after configuring the actual Atlas URI. Local development data is separate from Atlas and is not migrated automatically.

## Admin

Update gym copy, hero photo, stats, training services, trainers, equipment, curated reviews, hours and contact information. Add/remove list entries and upload photos, then **Save changes**. Read customer enquiries with pagination. Admin authentication uses an HttpOnly, SameSite cookie (Secure in production) with an eight-hour session. Write requests check the configured origin. Login and enquiry rate limits are stored in MongoDB across serverless instances.

The **Branches** tab manages each location's name, address, phone, hours, Sunday timings, description, optional photo and Google Maps link. Public branch cards generate directions automatically when no map link is set. Visitors can select their preferred branch in the enquiry form; the admin sees it with the message. Removing every branch hides the branch section and selector. Bhandup and Ghatkopar locality entries are included; fill exact addresses and approved contact details before launch.

Photos must be JPG, PNG or WebP, under 3 MB. They are decoded, resized, converted to WebP and stored in MongoDB GridFS, so Render redeploys do not remove them. No local upload disk is needed.

## Commands

```sh
npm run dev      # Both client and server
npm run build    # Client production build
npm run build:static # Public snapshot + build (requires BACKEND_ORIGIN)
npm start        # Standalone Node server serving client/dist
npm test         # Validation/auth tests; integration test if TEST_MONGODB_URI is set
npm run test:integration # Temporary local MongoDB; first run downloads its binary
npm run check    # Tests and production build
npm run format   # Format source files
```

For local integration testing, set `TEST_MONGODB_URI` to a test MongoDB instance and run `npm test`. Tests create and delete only a uniquely named disposable database. GitHub Actions runs the full suite against a MongoDB service.

## Deploy

Follow [DEPLOYMENT.md](./DEPLOYMENT.md) for Render/GitHub settings, Atlas setup, environment variables and live verification. Never commit `.env` or expose secrets through `VITE_` variables.

Sample names, photos, reviews, statistics, phone and hours need replacement before launch. Customer browsing/enquiries are public; reviews are curated by the admin. Memberships, payments and booking are outside this portfolio's scope.
