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
        const w = window as any;
        if (!w.wcs_add) w.wcs_add = {};
        w.wcs_add["wa"] = NAVER_ANALYTICS_ID;
        if (w.wcs) {
          w.wcs_do();
        }
      }}
    />
  );
}
