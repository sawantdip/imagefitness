# Render deployment through GitHub

Deploy one Render Node Web Service from https://github.com/sawantdip/imagefitness. The repository keeps frontend code in `client/` and backend code in `server/`; Express serves the built frontend and API on one origin.

- Website: `https://YOUR-SERVICE.onrender.com`
- Admin: `https://YOUR-SERVICE.onrender.com/admin`
- API: `https://YOUR-SERVICE.onrender.com/api`

## Deploy with the Blueprint

1. Sign in to Render and connect GitHub, granting access to `sawantdip/imagefitness`.
2. Choose New > Blueprint and select this repository's `main` branch. Render reads `render.yaml`.
3. Enter `MONGODB_URI`, `ADMIN_EMAIL` and `ADMIN_PASSWORD` when prompted. Use the actual Atlas URI and a password of at least 12 characters. Render generates `JWT_SECRET` automatically.
4. Create the service and wait for the deployment and `/api/health` check to succeed.

Open https://dashboard.render.com/select-repo?type=blueprint to start.

The Blueprint uses the free plan. Free services can sleep when idle, making the next request slower. You can select a paid plan in Render later if needed.

## Equivalent manual Web Service settings

| Setting | Value |
| --- | --- |
| Repository | `sawantdip/imagefitness` |
| Branch | `main` |
| Root directory | Leave empty (repository root) |
| Runtime | Node |
| Build command | `npm ci --include=dev && npm run build` |
| Start command | `npm start` |
| Health check | `/api/health` |
| NODE_VERSION | `22.19.0` |
| NODE_ENV | `production` |

For manual setup, also set the database/admin variables above and a random `JWT_SECRET` of at least 32 characters. Never commit `.env` or put secrets in frontend variables. Secrets have not been transferred from the local computer automatically.

`APP_ORIGIN` defaults to Render's `RENDER_EXTERNAL_URL`, so the assigned Render URL works without guessing a domain before deployment. If you switch to a custom domain, explicitly set `APP_ORIGIN` to that exact HTTPS origin and redeploy. Write requests from other origins are rejected.

Render provides `PORT`; the server uses it automatically. The app trusts Render's reverse proxy for HTTPS requests and serves `client/dist` for the website and direct admin navigation. There is no frontend/backend proxy configuration to maintain.

## MongoDB Atlas

Use an application database user with read/write access to the `imagefitness` database. Include the database name in the URI and URL-encode special characters in the password. Allow the service's outbound IP addresses in Atlas Network Access. Photos are stored in GridFS and persist across deploys; no Render disk is needed.

The server requires a successful database connection before starting. If the deploy fails to start, check the Atlas credentials, cluster availability and network allowlist. The last local Atlas connectivity attempt did not succeed; live connectivity must be verified after configuring Render.

## Checks

Run `npm run check` and `npm run test:integration` locally. After deployment, check the website, `/admin` refresh, login/logout, saving content, uploading photos and submitting an enquiry. `/api/health` returns `{"ok":true}` when MongoDB is connected.

GitHub pushes trigger deployments when Render automatic deployment is enabled. The earlier Vercel split deployment configuration has been reverted; the pre-existing combined Vercel config is retained only as a legacy file and is unused by Render.

Official references: https://render.com/docs/blueprint-spec , https://render.com/docs/deploy-node-express-app , https://render.com/docs/environment-variables .
