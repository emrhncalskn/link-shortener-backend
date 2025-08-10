# Link Shortener Backend

Kısa URL üreten, tıklamaları sayan ve istatistik sağlayan basit TypeScript/Express + MongoDB servisi.

## Özellikler (Kısa)

- JWT ile kimlik doğrulama (register / login)
- Link kısaltma (otomatik veya özel kısa kod)
- Tıklama sayacı + click log (IP, User-Agent)
- Link yönetimi (listeleme, güncelleme, silme, istatistik)
- Kullanıcı profil güncelleme & silme

## Hızlı Başlangıç

```bash
git clone <repo-url>
cd link-shortener-backend
npm install
cp .env.example .env   # (Yoksa elle oluştur)
npm run dev
```

Servis: http://localhost:3000

## .env Örneği

```
PORT=3000
MONGODB_URI=mongodb://root:admin@localhost:27017/appdb?authSource=admin
JWT_SECRET=super-secret-key
BASE_URL=http://localhost:3000
NODE_ENV=development
```

## Çalıştırma

- Geliştirme: `npm run dev`
- Build: `npm run build`
- Production: `npm start`

## MongoDB (Docker)

```bash
docker compose up -d
```

Mongo Express: http://localhost:8081

## Klasör Yapısı (Özet)

```
src/
  server.ts   # başlatma
  app.ts      # express app
  modules/    # auth, user, link
  utils/      # validate, encrypt, jwt, response
  db/         # mongoose bağlantı & index sync
```

## API

Base URL: `http://localhost:3000`

Kimlik doğrulama gereken endpointler Authorization: `Bearer <JWT>` başlığı ister. Public olanlar ayrıca belirtilmiştir.

### Auth

| Method | Path                | Auth  | Açıklama                                | Body                         |
| ------ | ------------------- | ----- | --------------------------------------- | ---------------------------- |
| POST   | /auth/register      | Hayır | Yeni kullanıcı oluşturur & JWT döner    | { username, password }       |
| POST   | /auth/login         | Hayır | Giriş yapar & JWT döner                 | { username, password }       |
| GET    | /auth/check         | Evet  | Authenticated mı?                       | -                            |

### User

| Method | Path                | Auth  | Açıklama                                | Body                         |
| ------ | ------------------- | ----- | --------------------------------------- | ---------------------------- |
| GET    | /user               | Evet  | Oturum açmış kullanıcının bilgisi       | -                            |
| PUT    | /user               | Evet  | Kullanıcıyı günceller                   | { username?, password? }     |
| DELETE | /user               | Evet  | Kullanıcıyı siler                       | -                            |

### Link

| Method | Path                | Auth  | Açıklama                                | Body / Param                 |
| ------ | ------------------- | ----- | --------------------------------------- | ---------------------------- |
| POST   | /shorten            | Evet  | Link kısaltır (opsiyonel customCode)    | { originalUrl, customCode? } |
| GET    | /links?page=&limit= | Evet  | Linklerini listeler (sayfalama)         | Query                        |
| GET    | /stats/:slug        | Evet  | Link istatistikleri (click log listesi) | Param                        |
| PUT    | /:slug              | Evet  | Kısa kodu günceller                     | { newShortCode }             |
| DELETE | /:slug              | Evet  | Linki siler                             | Param                        |
| GET    | /:slug              | Hayır | 301 redirect (kısa kod -> orijinal URL) | Param                        |

Not: `shorten`, `links`, `stats` gibi path'lerle çakışmayacak slug seçmeye dikkat edin.

## Örnek Akış

1. /auth/register
2. Dönen token ile Authorization: Bearer <token>
3. /shorten -> kısa URL al
4. /links veya /stats/:slug ile izle

## Örnek cURL

```bash
# Kayıt
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"password123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"password123"}'

# Link kısaltma
curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"originalUrl":"https://example.com"}'
```

## Hata Formatı (Özet)

```json
{
  "success": false,
  "message": "Link not found",
  "statusCode": 404,
  "timestamp": "..."
}
```
