"use client";

import Script from 'next/script';

export default function Analytics() {
  return (
    <>
      <Script
        id="firstpromoter"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.fpr = window.fpr || function() { (window.fpr.q = window.fpr.q || []).push(arguments) };
            fpr("init", {cid: "4z8yt1oa"});
            fpr("click");
          `
        }}
      />
      <Script
        src="https://cdn.firstpromoter.com/fprom.js"
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-16976727651');
          `
        }}
      />
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-16976727651"
        strategy="afterInteractive"
      />
    </>
  );
}
