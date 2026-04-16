# 🎮 GerritGames — Torrent Indexer

A high-performance, dynamic game torrent indexer built with **Node.js + Express + Prisma + Railway MySQL**, converted from your original Glassmorphism HTML site.

---

## 🗂️ Project Structure

```
gerritgames/
├── src/
│   ├── server.js                  # Express entry point
│   ├── db.js                      # Prisma client singleton
│   ├── routes/
│   │   ├── index.js               # Home, About, Contact, Category routes
│   │   ├── games.js               # Game detail, search, download trigger
│   │   └── api.js                 # JSON API (autocomplete, stats)
│   └── controllers/
│       └── torrentController.js   # parse-torrent integration
├── views/                         # EJS templates
│   ├── partials/
│   │   ├── header.ejs
│   │   ├── footer.ejs             # Includes uTorrent modal HTML
│   │   └── sidebar.ejs
│   ├── games/
│   │   └── detail.ejs             # Full game page with tabs
│   ├── index.ejs
│   ├── search.ejs
│   ├── category.ejs
│   ├── about.ejs
│   ├── contact.ejs
│   └── error.ejs
├── public/
│   ├── css/style.css              # Full Glassmorphism styles
│   ├── js/main.js                 # Download Bridge + Autocomplete + Slider
│   └── images/                   # Static assets (copy yours here)
├── prisma/
│   ├── schema.prisma              # Full relational DB schema
│   └── seed.js                   # Seeds all 9 games from your original HTML
├── .env.example                   # Environment variable template
├── railway.json                   # Railway build + deploy config
├── Procfile                       # Fallback deployment config
└── package.json
```

---

## 🚀 Railway Deployment — Step by Step

### Step 1: Create a Railway Project

1. Go to [railway.app](https://railway.app) → **New Project**
2. Choose **Deploy from GitHub repo** and connect your repository

### Step 2: Add a MySQL Database Service

1. In your Railway project dashboard, click **+ New Service**
2. Select **Database → MySQL**
3. Railway will automatically provision a MySQL instance

### Step 3: Link MySQL to Your App Service

This is the key step. Inside the Railway dashboard:

1. Click on your **App service** (the Node.js one)
2. Go to the **Variables** tab
3. Click **+ Add Variable Reference**
4. Select your **MySQL service** as the source
5. Add this variable:

   | Variable Name  | Value (Railway reference syntax)       |
   |----------------|----------------------------------------|
   | `DATABASE_URL` | `${{MySQL.DATABASE_URL}}`              |

   Railway automatically builds the full connection string using its **internal networking** (`mysql.railway.internal`), which is faster and free vs public networking.

   Alternatively, add individual variables:
   ```
   MYSQLHOST     = ${{MySQL.MYSQLHOST}}
   MYSQLPORT     = ${{MySQL.MYSQLPORT}}
   MYSQLUSER     = ${{MySQL.MYSQLUSER}}
   MYSQLPASSWORD = ${{MySQL.MYSQLPASSWORD}}
   MYSQLDATABASE = ${{MySQL.MYSQLDATABASE}}
   ```

   > **Why internal networking?**  Railway services on the same project communicate via private hostnames (`.railway.internal`) with zero egress cost and lower latency than public IPs.

### Step 4: Add App Environment Variables

In your App service **Variables** tab, add:

| Variable        | Value                          |
|-----------------|-------------------------------|
| `PORT`          | `3000`                        |
| `NODE_ENV`      | `production`                  |
| `SITE_NAME`     | `GerritGames`                 |
| `ITEMS_PER_PAGE`| `12`                          |

### Step 5: Deploy

Push to your connected GitHub branch. Railway will:

1. Run `npm install`
2. Run `npx prisma generate` (generates the Prisma Client)
3. Run `npx prisma migrate deploy` (applies DB migrations)
4. Start `node src/server.js`

This is automated via `railway.json`.

### Step 6: Seed the Database (one-time)

After first deployment, open the Railway **terminal** for your App service and run:

```bash
node prisma/seed.js
```

This inserts all 9 games from your original HTML site.

---

## 💻 Local Development

```bash
# 1. Clone and install
git clone <your-repo>
cd gerritgames
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your local MySQL credentials

# 3. Push schema to DB and generate client
npx prisma migrate dev --name init
npx prisma generate

# 4. Seed the database
node prisma/seed.js

# 5. Start dev server
npm run dev
# → http://localhost:3000
```

---

## 🗄️ Database Schema Overview

```
Game ──────────────────────────────────────────────────────
  id, title, slug*, magnetUri, infoHash, fileSize,
  description, thumbnailUrl, bannerUrl, platform,
  testedOn, architecture, version, downloads,
  isActive, isFeatured, createdAt, updatedAt

  ├── SystemRequirements (1:1)
  │     minOs, minCpu, minGpu, minRam, minStorage, minDirectX
  │     recOs, recCpu, recGpu, recRam, recStorage, recDirectX
  │     fixNotes
  │
  ├── GameCategory (M:M pivot) ──► Category
  │     id, name, slug
  │
  └── TorrentFile (1:M)
        path, length (for parsed magnet file listings)
```

---

## ⬇️ Download Bridge Logic Explained

The download flow (`public/js/main.js`) works in 3 steps:

```javascript
// 1. POST to server — increments download counter in MySQL
fetch(`/games/${slug}/download`, { method: 'POST' });

// 2. Trigger magnet: URI (opens the user's torrent client)
const anchor = document.createElement('a');
anchor.href = magnetUri;   // e.g. magnet:?xt=urn:btih:...
anchor.click();

// 3. Show "Download Starting" modal after 800ms
setTimeout(() => openDownloadModal(gameTitle), 800);
```

The modal contains:
- A "Download Starting..." message
- A **uTorrent installer** direct link
- A **qBittorrent** (open source) link as an alternative

---

## 🔧 Adding a New Game (with Torrent Parsing)

You can parse a `.torrent` file to auto-extract the info hash and file list:

```bash
# Via the API endpoint (multipart form upload)
curl -X POST http://localhost:3000/games/admin/parse-torrent \
  -F "torrent=@/path/to/game.torrent"
```

Response:
```json
{
  "ok": true,
  "metadata": {
    "infoHash": "abc123...",
    "name": "Elden Ring PC",
    "magnetUri": "magnet:?xt=urn:btih:abc123&dn=Elden+Ring+PC",
    "files": [
      { "path": "EldenRing/setup.exe", "length": 47244640256 }
    ],
    "totalSize": 47244640256
  }
}
```

Use this metadata when adding games to the database via Prisma Studio:

```bash
npx prisma studio   # Opens a GUI at http://localhost:5555
```

---

## 📡 API Endpoints

| Method | Route                       | Description                          |
|--------|-----------------------------|--------------------------------------|
| GET    | `/`                         | Home page                            |
| GET    | `/games/:slug`              | Game detail page                     |
| GET    | `/games/search?q=`          | Search results with pagination       |
| POST   | `/games/:slug/download`     | Track download + return magnet URI   |
| GET    | `/category/:slug`           | Filtered game listing                |
| GET    | `/api/search?q=`            | JSON autocomplete suggestions        |
| GET    | `/api/stats`                | JSON: total games + total downloads  |
| POST   | `/games/admin/parse-torrent`| Upload `.torrent`, get metadata JSON |

---

## 🖼️ Adding Your Images

Copy all images from your original site into `public/images/`:

```bash
cp original_site/images/* gerritgames/public/images/
```

Then update the `thumbnailUrl` and `bannerUrl` fields in the seed file or via Prisma Studio to point to `/images/your-image.jpg`.
