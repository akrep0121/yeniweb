# Vercel Authentication Troubleshooting

## Sorun: Localde çalışıyor, Vercel'de ana sayfaya atıyor

## Adım 1: Environment Variables Kontrolü

Vercel Dashboard → Project → Settings → Environment Variables

Aşağıdaki variable'ların tanımlı olduğundan emin olun:

```
ADMIN_PASSWORD=KJSA1660
JWT_SECRET=random-secret-key-bunu-degistir
```

**ÖNEMLİ:** Environment değerlerinin şu ortamlar için tanımlı olduğundan emin olun:
- ✅ Production
- ✅ Preview
- ✅ Development

## Adım 2: Manuel Redeploy

1. Vercel Dashboard'da projeyi açın
2. **Deployments** sekmesine gidin
3. En son deployment'ın yanındaki **⋯** (three dots) menüsüne tıklayın
4. **Redeploy** seçeneğini seçin
5. Bekleyin ve tamamlanınca test edin

## Adım 3: Vercel Log Viewer ile Kontrol

1. **Deployments** sekmesine gidin
2. En son deployment'ın üzerine tıklayın
3. **Logs** sekmesine gidin
4. **Filter** ile `Auth` veya `auth` arayın

Aşağıdaki logları görmelisiniz:

```
GET auth - Token exists: true
GET auth - JWT_SECRET exists: true
Token decoded successfully: { isAdmin: true, ... }
```

Eğer şu logları görüyorsanız:
```
GET auth - JWT_SECRET exists: false
```

→ **JWT_SECRET environment variable tanımlı değil!**

## Adım 4: Console Kontrolü

1. Production sitenizi açın (yeniweb.vercel.app)
2. F12 basın ve **Console** sekmesine gidin
3. Ctrl + Shift + A ile admin login'e gidin
4. Şifreyi girin ve giriş yapın
5. Console'da şu logları görmelisiniz:

```
Checking auth, token exists: true
Auth response status: 200
Auth success: { authenticated: true, isAdmin: true }
```

Eğer `Auth failed:` veya error görüyorsanız, sorun environment variable'lardadır.

## Adım 5: Browser Cache Temizleme

Tarayıcı cache'i temizleyin:
1. F12 basın
2. **Application** sekmesine gidin
3. **Clear storage** → **Clear site data**
4. Sayfayı yenileyin (Ctrl + Shift + R)
5. Tekrar deneyin

## Adım 6: JWT Secret Oluşturma

Rastgele güvenli bir JWT secret oluşturmak için:

Terminal'da çalıştırın:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Çıktıyı Vercel'de `JWT_SECRET` olarak kullanın.

## Adım 7: Özet Kontrol Listesi

- [ ] `ADMIN_PASSWORD` environment variable tanımlı mı?
- [ ] `JWT_SECRET` environment variable tanımlı mı?
- [ ] Variable'lar Production, Preview, Development için tanımlı mı?
- [ ] Manuel redeploy yapıldı mı?
- [ ] Vercel Log Viewer'da `JWT_SECRET exists: true` görünüyor mu?
- [ ] Browser cache temizlendi mi?
- [ ] Console'da `Auth success` görünüyor mu?

## Hala Çözülemedi mi?

Console çıktısını ve Vercel loglarını bana paylaşın.
