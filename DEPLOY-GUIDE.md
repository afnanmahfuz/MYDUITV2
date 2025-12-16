# 🚀 MYDUIT V6 - PANDUAN DEPLOY DENGAN APPWRITE

## 📋 Overview

Panduan lengkap untuk deploy MyDuit v6 menggunakan:
- **GitHub** - Code repository
- **Appwrite** - Backend (Database, Auth, Storage)
- **Vercel** - Frontend hosting

---

## STEP 1: CREATE APPWRITE ACCOUNT (5 minit)

1. Buka: **https://cloud.appwrite.io**
2. Klik **"Sign Up"**
3. Pilih **Continue with GitHub** (recommended)
4. Done! ✅

---

## STEP 2: CREATE APPWRITE PROJECT (5 minit)

1. Klik **"Create project"**
2. Isi:
   ```
   Project name: myduit
   ```
3. **COPY Project ID** - save!

---

## STEP 3: CREATE DATABASE (15 minit)

### 3.1 Create Database

1. Sidebar > **Databases** > **Create database**
2. Isi:
   ```
   Database ID: myduit-db
   Name: MyDuit Database
   ```

### 3.2 Create Collections

Buat 12 collections dengan settings ini:

| Collection ID | Name | Document Security |
|---------------|------|-------------------|
| households | Households | ✅ ON |
| members | Members | ✅ ON |
| income | Income | ✅ ON |
| commitments | Commitments | ✅ ON |
| transactions | Transactions | ✅ ON |
| savings | Savings | ✅ ON |
| investments | Investments | ✅ ON |
| insurance | Insurance | ✅ ON |
| goals | Financial Goals | ✅ ON |
| zakat | Zakat | ✅ ON |
| faraid | Faraid | ✅ ON |
| budget_settings | Budget Settings | ✅ ON |

**Untuk setiap collection:**
1. Settings > Permissions
2. Add: **Users** → ✅ Create
3. Enable **Document Security**

**Lihat `APPWRITE-ARCHITECTURE.md` untuk attributes setiap collection**

---

## STEP 4: CREATE API KEY (5 minit)

1. **Settings** > **API Keys** > **Create API Key**
2. Name: `MyDuit Server`
3. Scopes:
   - ✅ databases.read
   - ✅ databases.write
   - ✅ users.read
   - ✅ teams.read
   - ✅ teams.write
4. **COPY API KEY** - hanya shown sekali!

---

## STEP 5: ADD WEB PLATFORM (Penting!)

1. **Overview** > **Add platform** > **Web App**
2. Isi:
   ```
   Name: MyDuit Web
   Hostname: localhost
   ```
3. Add another untuk production:
   ```
   Name: MyDuit Production
   Hostname: your-app.vercel.app
   ```

---

## STEP 6: SETUP GITHUB (10 minit)

1. Create repo: `myduit-app`
2. Upload semua project files
3. Pastikan `package.json` di root

---

## STEP 7: DEPLOY TO VERCEL (10 minit)

1. **vercel.com** > Login with GitHub
2. **Import** repo `myduit-app`
3. **Environment Variables:**

| NAME | VALUE |
|------|-------|
| `NEXT_PUBLIC_APPWRITE_ENDPOINT` | `https://cloud.appwrite.io/v1` |
| `NEXT_PUBLIC_APPWRITE_PROJECT_ID` | [Your Project ID] |
| `NEXT_PUBLIC_APPWRITE_DATABASE_ID` | `myduit-db` |
| `APPWRITE_API_KEY` | [Your API Key] |

4. **Deploy!**

---

## STEP 8: TEST (5 minit)

1. Buka app URL
2. Test signup/login
3. Test add transaction
4. Check data di Appwrite Console

---

## 🔐 PERMISSIONS

### Document Permissions

```javascript
// Owner only
Permission.read(Role.user(userId))
Permission.update(Role.user(userId))
Permission.delete(Role.user(userId))

// Share with team
Permission.read(Role.team(teamId))
```

---

## 🛠️ TROUBLESHOOTING

| Error | Fix |
|-------|-----|
| "Network request failed" | Add platform di Appwrite |
| "Missing scope" | Update API key scopes |
| "Document not found" | Check permissions |
| Data not saving | Check collection permissions |

---

## 📚 RESOURCES

- [Appwrite Docs](https://appwrite.io/docs)
- [Appwrite Discord](https://discord.gg/appwrite)
- [Next.js + Appwrite Tutorial](https://appwrite.io/docs/quick-starts/nextjs)

---

**Version:** 6.0
**Backend:** Appwrite Cloud
