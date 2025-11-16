import { useEffect } from "react";

interface InterstitialAdProps {
  onAdClosed?: () => void;
}

const InterstitialAd = ({ onAdClosed }: InterstitialAdProps) => {
  useEffect(() => {
    const loadInterstitialAd = () => {
      try {
        // @ts-ignore
        const adsbygoogle = window.adsbygoogle || [];
        adsbygoogle.push({
          google_ad_client: "ca-app-pub-5449536249633870",
          enable_page_level_ads: true,
          overlays: { bottom: true }
        });
      } catch (err) {
        console.error("Interstitial ad error:", err);
      }
    };

    loadInterstitialAd();
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "none" }}
      data-ad-client="ca-app-pub-5449536249633870"
      data-ad-slot="9158403394"
      data-ad-format="interstitial"
      data-ad-region="interstitial"
    />
  );
};

export default InterstitialAd;
