# 🚨 Firebase Permission Sorunu Çözümü

## Sorun
Firestore permission hatası alıyorsunuz: `Missing or insufficient permissions.`

## Çözüm Adımları

### 1. Firebase Console'a Git
https://console.firebase.google.com/project/yeni-proje-21ad7/firestore/rules

### 2. Rules Sekmesine Git
- **Firestore Database** → **Rules** sekmesine tıklayın

### 3. Kuralları Güncelle
Mevcut kuralları silip aşağıdakileri yapıştırın:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Publish Et
- **Publish** butonuna tıklayın

### 5. Test Et
- http://localhost:3000/admin
- Giriş yap: admin@example.com / KJSA1660
- Blog listesi görüntüleme

## Başarı İşaretleri
✅ Admin panel açılıyor
✅ Blog listesi görünüyor
✅ Yeni blog ekleyebiliyorsunuz
✅ Blog silebiliyorsunuz
✅ Blog düzenleyebiliyorsunuz
