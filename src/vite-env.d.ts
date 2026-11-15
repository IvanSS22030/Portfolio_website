/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare module "*.wav" {
  const src: string;
  export default src;
}

declare module "*.mp3" {
  const src: string;
  export default src;
} 