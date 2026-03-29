"use client";

import Script from "next/script";

const NAVER_ANALYTICS_ID = process.env.NEXT_PUBLIC_NAVER_ANALYTICS_ID;

export default function NaverAnalytics() {
  if (!NAVER_ANALYTICS_ID) return null;

  return (
    <Script
      src="//wcs.pstatic.net/wcslog.js"
      strategy="afterInteractive"
      onLoad={() => {
        if (!window.wcs_add) window.wcs_add = {};
        window.wcs_add["wa"] = NAVER_ANALYTICS_ID;
        if (window.wcs) {
          window.wcs_do();
        }
      }}
    />
  );
}
