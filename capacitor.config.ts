import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.65a53e634d6b47d4825b0280a7b27183',
  appName: 'brand-spark-global',
  webDir: 'dist',
  server: {
    url: 'https://65a53e63-4d6b-47d4-825b-0280a7b27183.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    AdMob: {
      appId: 'ca-app-pub-5449536249633870~3347511713',
    },
  },
};

export default config;
