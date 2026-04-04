/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AMPLIFY_REST_API_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
