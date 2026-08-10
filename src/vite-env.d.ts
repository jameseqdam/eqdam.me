/// <reference types="vite/client" />

// gtag.js is loaded by the inline snippet in index.html, so the global exists
// at runtime without a module import.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export {};
