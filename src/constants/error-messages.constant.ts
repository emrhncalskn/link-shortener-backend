export const ERROR_MESSAGES = {
  // Auth-related errors
  USER_NOT_FOUND: "Kullanıcı bulunamadı",
  INVALID_CREDENTIALS: "Geçersiz kullanıcı bilgileri",
  FAILED_TO_LOGIN: "Giriş yapılamadı",
  FAILED_TO_REGISTER: "Kayıt oluşturulamadı",
  FAILED_TO_CREATE_USER: "Kullanıcı oluşturulamadı",
  USER_ALREADY_EXISTS: "Kullanıcı zaten mevcut",
  UNAUTHORIZED_ACCESS: "Yetkisiz erişim",

  // User-related errors
  FAILED_TO_UPDATE_USER: "Kullanıcı güncellenemedi",
  FAILED_TO_DELETE_USER: "Kullanıcı silinemedi",
  FAILED_TO_GET_USER: "Kullanıcı bilgileri alınamadı",

  // Link-related errors
  LINK_NOT_FOUND: "Link bulunamadı",
  CUSTOM_CODE_ALREADY_EXISTS: "Özel kod zaten kullanılıyor",
  FAILED_TO_CREATE_LINK: "Link oluşturulamadı",
  FAILED_TO_REDIRECT_LINK: "Link yönlendirmesi başarısız",
  FAILED_TO_RETRIEVE_LINKS: "Linkler alınamadı",
  FAILED_TO_GET_LINK_ANALYTICS: "Link analitiği alınamadı",
  FAILED_TO_DELETE_LINK: "Link silinemedi",
  FAILED_TO_UPDATE_LINK: "Link güncellenemedi",
  COULD_NOT_GENERATE_UNIQUE_SHORT_CODE:
    "Benzersiz kısa kod üretilemedi, lütfen tekrar deneyin",
  FAILED_TO_LOG_CLICK: "Tıklama kaydedilemedi",
  INVALID_URL_FORMAT: "Geçersiz URL formatı",

  // General errors
  INTERNAL_SERVER_ERROR: "Sunucu hatası",
  BAD_REQUEST: "Geçersiz istek",
  FORBIDDEN: "Yasak",
  CONFLICT: "Çakışma",
  VALIDATION_ERROR: "Doğrulama hatası",
  MISSING_REQUIRED_FIELDS: "Gerekli alanlar eksik",
  INVALID_INPUT: "Geçersiz girdi",

  // Token-related errors
  INVALID_TOKEN: "Geçersiz token",
  TOKEN_EXPIRED: "Token süresi doldu",
  TOKEN_REQUIRED: "Token gerekli",
  FAILED_TO_VERIFY_TOKEN: "Token doğrulanamadı",

  // Database errors
  DATABASE_CONNECTION_ERROR: "Veritabanı bağlantı hatası",
  DATABASE_OPERATION_FAILED: "Veritabanı işlemi başarısız",

  // File/Upload errors
  FILE_NOT_FOUND: "Dosya bulunamadı",
  INVALID_FILE_TYPE: "Geçersiz dosya türü",
  FILE_TOO_LARGE: "Dosya çok büyük",
  UPLOAD_FAILED: "Dosya yüklenemedi",

  // Rate limiting
  TOO_MANY_REQUESTS: "Çok fazla istek",
  RATE_LIMIT_EXCEEDED: "Hız sınırı aşıldı",

  // Pagination errors
  INVALID_PAGE_NUMBER: "Geçersiz sayfa numarası",
  INVALID_LIMIT: "Geçersiz limit değeri",

  // Success messages
  AUTHENTICATED: "Kimlik doğrulandı",
} as const;

export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;
