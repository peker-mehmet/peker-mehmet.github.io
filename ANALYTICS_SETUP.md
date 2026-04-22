# Google Analytics 4 Setup

## 1. Create a GA4 Property

1. Go to [analytics.google.com](https://analytics.google.com) and sign in with your Google account.
2. Click **Admin** (gear icon, bottom-left).
3. Under **Account**, click **Create Account** if you don't have one, or select an existing account.
4. Under **Property**, click **Create Property**.
5. Enter a name (e.g. "Mehmet Peker Academic Website"), select your timezone and currency, click **Next**.
6. Fill in your business details, click **Create**.
7. Choose **Web** as your platform.
8. Enter your website URL (`https://peker-mehmet.github.io`) and a stream name, click **Create stream**.
9. Copy the **Measurement ID** — it looks like `G-XXXXXXXXXX`.

## 2. Add the Measurement ID locally

Open `.env.local` in the project root and replace the placeholder:

```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your real Measurement ID.

> `.env.local` is already in `.gitignore` — it will never be committed.

## 3. Add the secret to GitHub Actions

So that production deploys pick up the real ID:

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**.
2. Click **New repository secret**.
3. Name: `NEXT_PUBLIC_GA_ID`
4. Value: your Measurement ID (e.g. `G-ABC123DEF4`)
5. Click **Add secret**.

The workflow in `.github/workflows/deploy.yml` already reads this secret and passes it to the build.

## 4. Verify

After pushing to `main` and the deploy completes:

1. Open the live site in your browser.
2. In GA4, go to **Reports** → **Realtime** — you should see your own visit appear within 30 seconds.

## Custom Events Tracked

| Event name | Triggered when |
|---|---|
| `file_download` | User clicks a PDF download button (scales or publications) |
| `citation_copy` | User clicks the "Copy Citation" button |
| `language_switch` | User switches between Turkish and English |
| `interest_click` | User clicks a research interest pill on the homepage |

> All events fire only in production builds. Local `next dev` and `next build` in development will not send events.
