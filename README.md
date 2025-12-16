# MyDuit v6 - Smart Family Finance

Aplikasi pengurusan kewangan keluarga Malaysia dengan sokongan Islamic finance.

## 🚀 Features

- **Dashboard** - Paparan ringkas kewangan keluarga
- **Budget 50/30/20** - Perancangan bajet bulanan
- **Debt Tracker** - Pantau dan bebas hutang
- **Savings Goals** - Matlamat simpanan
- **Investment Portfolio** - Pelaburan dengan Shariah compliance indicator
- **Zakat Calculator** - Kira zakat pendapatan, simpanan, emas, pelaburan
- **Faraid Simulator** - Simulasi pembahagian pusaka
- **PWA Support** - Install sebagai app di phone

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS
- **Backend:** Appwrite Cloud
- **State:** Zustand
- **Animation:** Framer Motion
- **Icons:** Lucide React

## 📦 Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd myduit-v6
npm install
```

### 2. Setup Appwrite

1. Create account at [cloud.appwrite.io](https://cloud.appwrite.io)
2. Create project `myduit`
3. Create database `myduit-db`
4. Run setup script:
   ```bash
   npm run setup
   ```
5. Add Web Platform (localhost:3000 + production URL)

### 3. Configure Environment

```bash
cp .env.local.example .env.local
# Edit .env.local with your Appwrite credentials
```

### 4. Run Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

## 📁 Project Structure

```
myduit-v6/
├── app/
│   ├── globals.css
│   ├── layout.jsx
│   └── page.jsx
├── lib/
│   └── appwrite.js
├── stores/
│   └── useAppStore.js
├── scripts/
│   └── setup-appwrite.js
├── public/
│   ├── manifest.json
│   └── icons/
└── package.json
```

## 📖 Documentation

- [APPWRITE-ARCHITECTURE.md](./APPWRITE-ARCHITECTURE.md) - Database schema
- [DEPLOY-GUIDE.md](./DEPLOY-GUIDE.md) - Step-by-step deploy
- [ARCHITECTURE-VISUAL.md](./ARCHITECTURE-VISUAL.md) - Visual diagrams

## 📝 License

MIT

---

**Version:** 6.0.0  
**Backend:** Appwrite Cloud
