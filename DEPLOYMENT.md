# Vercel + MongoDB Atlas

Deploy this repository as **one Vercel project**: static React assets plus the Express `/api/index.js` function. Site content, enquiries, rate-limit counters and photos live in MongoDB. The function needs no writable filesystem.

## Atlas

1. Rotate the database password shared in chat.
2. In Atlas → Database Access, create/use an application database user with `readWrite` access to the `imagefitness` database. Your Atlas login email is not the database username.
3. Copy Connect → Drivers connection string. Replace username/password, URL-encode password special characters, and include database `imagefitness`:

```text
mongodb+srv://sawantsdip4002_db_user:YOUR_NEW_PASSWORD@cluster0.0uik3xj.mongodb.net/imagefitness?retryWrites=true&w=majority
```

4. Configure Atlas Network Access for your local public IP and hosting environment. Prefer fixed egress with an IP allowlist if available on your Vercel plan; shared outbound addresses may require a broader allowlist. Limit database permissions and use strong credentials.

Official docs: [Connection strings](https://www.mongodb.com/docs/manual/reference/connection-string/) and [Atlas/Vercel integration](https://www.mongodb.com/docs/atlas/reference/partner-integrations/vercel/).

## Vercel project

Push the repository to GitHub, then Vercel → Add New Project → Import repository.

| Setting          | Value                               |
| ---------------- | ----------------------------------- |
| Root Directory   | Repository root (`.`), not `client` |
| Framework Preset | Other                               |
| Node.js          | 22.x                                |
| Install Command  | `npm ci`                            |
| Build Command    | `npm run build`                     |
| Output Directory | `client/dist`                       |

`vercel.json` configures API rewrites, direct admin navigation, build output and headers. The API exports a handler instead of starting a persistent listener. See [Express on Vercel](https://vercel.com/docs/frameworks/backend/express).

## Environment variables

Set these in Vercel → Project Settings → Environment Variables:

| Variable         | Value                                                          |
| ---------------- | -------------------------------------------------------------- |
| `MONGODB_URI`    | Complete Atlas URI with database username and new password     |
| `JWT_SECRET`     | Random secret, at least 32 characters                          |
| `ADMIN_EMAIL`    | Admin sign-in email                                            |
| `ADMIN_PASSWORD` | Unique password, at least 12 characters                        |
| `APP_ORIGIN`     | Exact canonical origin, e.g. `https://imagefitness.vercel.app` |
| `NODE_ENV`       | `production`                                                   |

Generate a secret locally:

```sh
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Never use `VITE_` for secrets, put credentials in frontend code, or commit `.env`. `APP_ORIGIN` must be the URL used for forms/admin, without a path. Configure a separate origin/database for preview deployments. Update the origin when switching to a custom domain. Redeploy after changing environment variables. The initial deployment may show a configuration error until the final domain and environment variables are set.

## Live verification

1. `/api/health` returns `{"ok":true}` when MongoDB connects.
2. Public website and direct `/admin` refresh load correctly.
3. Sign in using the configured admin credentials.
4. Edit and save a text field, then refresh to confirm persistence.
5. Upload a photo, save, and confirm it remains after redeploy.
6. Submit an enquiry and find it in the admin Enquiries tab.
7. Log out and confirm protected operations require sign-in.
8. Replace sample profiles, photos, statistics, hours, phone and reviews with approved gym information before launch.

Uploads are limited to 3 MB, below [Vercel's function payload limit](https://vercel.com/docs/functions/limitations). Images are processed to WebP and stored publicly in GridFS. Customer enquiries require admin access. Monitor Atlas storage and configure appropriate backups. Unused uploaded images remain stored; periodically clean up orphaned media if needed.

## Troubleshooting

- `503 Server configuration is incomplete`: check environment variables, password/secret lengths and HTTPS origin.
- `503 Database is unavailable`: check database user, network allowlist, URI and cluster status.
- `403 Request origin is not allowed`: set `APP_ORIGIN` to the exact URL in the browser, then redeploy.
- `413`: image exceeds 3 MB or request is too large.
- `401`: sign in again; sessions expire after eight hours.

`npm run check` runs security/validation tests and builds React. Set `TEST_MONGODB_URI` to run the disposable-database integration test, or use the included GitHub Actions workflow.

Deployment configuration is prepared locally. A real Atlas connection and Vercel deployment still require your account/environment configuration; `<db_username>` is not a working username.
