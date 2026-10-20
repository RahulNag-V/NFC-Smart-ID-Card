/// <reference types="vite/client" />

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

interface ImportMetaEnv {
  readonly VITE_NOTIFICATION_WEBHOOK_URL?: string;
  readonly VITE_CALLMEBOT_API_KEY?: string;
  readonly VITE_FAST2SMS_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
