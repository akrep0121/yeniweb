# Vercel Environment Variables

Bu proje için Vercel'de şu environment variables'ı eklemelisin:

## Environment Variables

Vercel Dashboard → Project → Settings → Environment Variables

```
ADMIN_PASSWORD=KJSA1660
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Notlar

- `ADMIN_PASSWORD`: Admin paneli için şifre
- `JWT_SECRET`: JWT token imzalamak için gizli anahtar (production'da rastgele bir string kullanın)
- Bu dosya (.env.local) GitHub'a push edilmez (.gitignore'da)
- Production ortamında Vercel'de environment variable olarak eklenmelidir

## JWT Secret Üretimi

Rastgele bir JWT secret üretmek için:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
