# AS CRM — Installable Cloud CRM

Live app: https://abeershah09.github.io/as-crm/

## Install AS CRM

**Windows (Edge):** Open the live link in Microsoft Edge, select **⋯ > More tools > Apps > Install this site as an app**, or use the install icon in the address bar.

**Android (Chrome):** Open the live link in Chrome, tap **⋮ > Install app** (or **Add to Home screen**). Confirm installation.

**iPhone (Safari):** Open in Safari, tap **Share > Add to Home Screen**, optionally **Open as Web App**, then **Add**.

Alternatively, use the **Install** button in the AS CRM header or **Settings > Install AS CRM as an App**. If automatic prompting is unavailable, the app displays browser-specific installation instructions.

The PWA runs in its own app window where supported, with an icon and a subset of offline functionality. There is no separate APK or EXE; it uses the website at the link above.

## Cloud sync and offline use

The **Cloud** setup requires a Supabase project URL and publishable/anon key on each new device, then login with the *same account* on laptop and phone. Supabase keys and credentials are not baked into the public repository.

The PWA precaches its app shell. Changes made offline remain locally stored; synchronization requires a working connection and signed-in session. Keep JSON backups of business records. Wait for **Cloud synced** before relying on another device.

## Updates

The service worker checks network first, falls back to cache offline and versioned cache names avoid stale app files. Use **Settings > Check for updates** to ask the browser to check, and reopen or reload the installed app after updates.

### Security

GitHub Pages is public; client data should be guarded by your Supabase authentication and row-level security policies. Never use or publish secret/service-role keys in a browser app.
