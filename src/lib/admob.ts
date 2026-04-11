import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, AdOptions } from '@capacitor-community/admob';
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
  if (!Capacitor.isNativePlatform() || !admobInitialized) return;

  try {
    const options: BannerAdOptions = {
      adId: BANNER_AD_ID,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.TOP_CENTER,
      margin: 0,
    };
    await AdMob.showBanner(options);
    console.log('Banner ad shown');
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

export async function showInterstitialAd(): Promise<void> {
  if (!Capacitor.isNativePlatform() || !admobInitialized) return;

  try {
    await AdMob.prepareInterstitial({ adId: INTERSTITIAL_AD_ID });
  } catch (error) {
    console.error('Interstitial prepare error:', error);
    return;
  }

  try {
    await AdMob.showInterstitial();
    console.log('Interstitial ad shown');
  } catch (error) {
    console.error('Interstitial show error:', error);
  }
}
