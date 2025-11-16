import { useEffect } from "react";

interface AdBannerProps {
  slot: string;
  format?: string;
  responsive?: boolean;
  className?: string;
}

const AdBanner = ({ slot, format = "auto", responsive = true, className = "" }: AdBannerProps) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-app-pub-5449536249633870"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
};

export default AdBanner;
