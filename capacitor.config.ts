import type { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.quickcash.app',
  appName: 'QuickCash',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: 'http://localhost:8080',
    cleartext: true
  }
};

export default config;