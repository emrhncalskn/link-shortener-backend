export const SUCCESS_MESSAGES = {
  AUTHENTICATED: "Kimlik doğrulandı",

  LINK_DELETED: "Link başarıyla silindi",

  OPERATION_SUCCESSFUL: "İşlem başarılı",
} as const;

export type SuccessMessageKey = keyof typeof SUCCESS_MESSAGES;
