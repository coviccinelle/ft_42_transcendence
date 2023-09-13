declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VITE_DOMAIN_NAME: string;
    }
  }
}

export {}
