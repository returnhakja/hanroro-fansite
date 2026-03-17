import Script from "next/script";

const NAVER_ANALYTICS_ID = process.env.NEXT_PUBLIC_NAVER_ANALYTICS_ID;

export default function NaverAnalytics() {
  if (!NAVER_ANALYTICS_ID) return null;

  return (
    <Script id="naver-analytics" strategy="afterInteractive">
      {`
        if(!wcs_add) var wcs_add={};
        wcs_add["wa"] = "${NAVER_ANALYTICS_ID}";
        if(window.wcs) {
          wcs_do();
        }
      `}
    </Script>
  );
}
