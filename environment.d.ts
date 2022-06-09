export { };

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_API_KEY: string,
      DB_AUTH_DOMAIN: string,
      DB_PROJECT_ID: string,
      DB_STORAGE_BUCKET: string
      DB_MESSAGING_SENDER_ID: string,
      DB_APP_ID: string,
      CAAD_PWS: string,
      ROOT_PWS: string
    }
  }
}
