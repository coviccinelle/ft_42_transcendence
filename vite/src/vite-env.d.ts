/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DOMAIN_NAME: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
