# Cloudflare Worker OAuth Proxy Setup

Self-hosted OAuth proxy for Sveltia CMS using Cloudflare Workers (free tier).

## Steps

### 1. Create a Cloudflare Account
Go to https://cloudflare.com and create a free account.

### 2. Create a New Worker
- Click **Workers & Pages** in the left sidebar
- Click **Create** → **Worker**
- Name it: `cms-oauth-proxy`
- Click **Deploy**

### 3. Add the Worker Code
- Click **Edit code** and replace everything with:

```js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/auth') {
      const params = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        redirect_uri: env.CALLBACK_URL,
        scope: 'repo,user',
        state: Math.random().toString(36).substring(7)
      });
      return Response.redirect(
        `https://github.com/login/oauth/authorize?${params}`,
        302
      );
    }

    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      const response = await fetch(
        'https://github.com/login/oauth/access_token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            client_id: env.GITHUB_CLIENT_ID,
            client_secret: env.GITHUB_CLIENT_SECRET,
            code
          })
        }
      );
      const data = await response.json();
      const token = data.access_token;
      return new Response(
        `<html><body><script>
          window.opener.postMessage(
            'authorization:github:success:${JSON.stringify({token})}',
            '*'
          );
          window.close();
        </script></body></html>`,
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    return new Response('Not found', { status: 404 });
  }
};
```

- Click **Save and deploy**

### 4. Set Environment Variables
Go to **Worker Settings** → **Variables** and add:

| Variable | Value |
|---|---|
| `GITHUB_CLIENT_ID` | `Ov23liDa7GLrOVRLEkUB` |
| `GITHUB_CLIENT_SECRET` | `[your secret from GitHub OAuth App]` |
| `CALLBACK_URL` | `https://cms-oauth-proxy.[yourname].workers.dev/callback` |

### 5. Copy Your Worker URL
Your worker URL looks like:
```
https://cms-oauth-proxy.[yourname].workers.dev
```

### 6. Update config.yml
Edit `public/admin/config.yml` — replace the `base_url` line:

```yaml
backend:
  name: github
  repo: peker-mehmet/peker-mehmet.github.io
  branch: main
  base_url: https://cms-oauth-proxy.[yourname].workers.dev
  auth_endpoint: /auth
  client_id: Ov23liDa7GLrOVRLEkUB
```

### 7. Update GitHub OAuth App Callback URL
Go to https://github.com/settings/developers → your **Academic Website CMS** OAuth App
→ change **Authorization callback URL** to:

```
https://cms-oauth-proxy.[yourname].workers.dev/callback
```

Click **Update application**.

### 8. Commit and Push
```bash
git add public/admin/config.yml
git commit -m "Switch to self-hosted Cloudflare Worker OAuth proxy"
git push
```

After the GitHub Actions deploy completes, the CMS at
https://peker-mehmet.github.io/admin/ will authenticate via your own worker.
