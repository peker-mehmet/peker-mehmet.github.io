# GitHub OAuth App Setup for Sveltia CMS

Sveltia CMS uses GitHub OAuth directly — no Netlify account needed.
You need a GitHub OAuth App so the CMS can authenticate editors.

## Steps

### Step 1: Open GitHub Developer Settings
Go to: https://github.com/settings/developers

### Step 2: Create a New OAuth App
Click **OAuth Apps** → **New OAuth App**

### Step 3: Fill in the App Details

| Field | Value |
|---|---|
| Application name | Academic Website CMS |
| Homepage URL | https://peker-mehmet.github.io |
| Authorization callback URL | https://sveltia-cms-auth.pages.dev/callback |

> **Important:** The callback URL must point to Sveltia's auth proxy, not your site.

### Step 4: Register and Copy Credentials
1. Click **Register application**
2. Copy the **Client ID** (visible immediately)
3. Click **Generate a new client secret** and copy it — it is only shown once

### Step 5: Configure the Sveltia Auth Proxy
Sveltia provides a free hosted OAuth proxy at `sveltia-cms-auth.pages.dev`.
To register your GitHub OAuth App with it, visit:

  https://sveltia-cms-auth.pages.dev

Follow the instructions there to link your Client ID and Client Secret.
(This is a one-time setup — no server or Netlify account required.)

### Step 6: Access the CMS
After setup, go to:

  https://peker-mehmet.github.io/admin/

Click **Login with GitHub** and authorize the OAuth App when prompted.

## Notes

- `config.yml` is already updated with the correct `backend` section.
- `public/admin/index.html` now loads Sveltia CMS instead of Decap CMS.
- The Netlify site (`courageous-clafoutis-36a19d.netlify.app`) is no longer needed
  for CMS authentication. It can be kept or deleted — it does not affect the
  live GitHub Pages site.
