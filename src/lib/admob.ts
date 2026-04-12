import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

const BANNER_AD_ID = 'ca-app-pub-5449536249633870/8092733376';
const INTERSTITIAL_AD_ID = 'ca-app-pub-5449536249633870/9158403394';

let admobInitialized = false;
let generationCount = 0;

export async function initializeAdMob(): Promise<void> {
  if (admobInitialized) return;
  if (!Capacitor.isNativePlatform()) {
    console.log('AdMob skipped: not a native platform');
    return;
  }

  try {
    await AdMob.initialize();
    admobInitialized = true;
    console.log('AdMob initialized successfully');
  } catch (error) {
    console.error('AdMob initialization failed:', error);
  }
}

export async function showBannerAd(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  // Wait for initialization if it hasn't completed yet
  if (!admobInitialized) {
    try {
      await AdMob.initialize();
      admobInitialized = true;
    } catch (e) {
      console.error('AdMob late init failed:', e);
      return;
    }
  }

  try {
    const options: BannerAdOptions = {
      adId: BANNER_AD_ID,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.TOP_CENTER,
      margin: 0,
    };
    await AdMob.showBanner(options);
    console.log('Banner ad shown at top');
  } catch (error) {
    console.error('Banner ad error:', error);
  }
}

export async function hideBannerAd(): Promise<void> {
  if (!Capacitor.isNativePlatform() || !admobInitialized) return;

  try {
    await AdMob.hideBanner();
    console.log('Banner ad hidden');
  } catch (error) {
    console.error('Banner ad hide error:', error);
  }
}

/**
 * Prepares an interstitial ad in advance so it's ready to show instantly.
 */
export async function prepareInterstitialAd(): Promise<void> {
  if (!Capacitor.isNativePlatform() || !admobInitialized) return;

  try {
    await AdMob.prepareInterstitial({ adId: INTERSTITIAL_AD_ID });
    console.log('Interstitial ad prepared');
  } catch (error) {
    console.error('Interstitial prepare error:', error);
  }
}

/**
 * Shows interstitial ad only on every 2nd generation.
 * Returns true if ad was shown (caller can use this info).
 */
export async function showInterstitialAd(): Promise<boolean> {
  generationCount++;

  // Show ad on every 2nd attempt (2nd, 4th, 6th...)
  if (generationCount % 2 !== 0) {
    console.log(`Generation #${generationCount}: ad-free`);
    return false;
  }

  if (!Capacitor.isNativePlatform() || !admobInitialized) return false;

  try {
    // Prepare and show immediately
    await AdMob.prepareInterstitial({ adId: INTERSTITIAL_AD_ID });
    await AdMob.showInterstitial();
    console.log(`Generation #${generationCount}: interstitial ad shown`);
    return true;
  } catch (error) {
    console.error('Interstitial ad error:', error);
    return false;
  }
}
