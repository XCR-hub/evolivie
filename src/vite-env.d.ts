/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NEOLIANE_CLIENT_ID: string
  readonly VITE_NEOLIANE_CLIENT_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}