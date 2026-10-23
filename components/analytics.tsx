import Script from "next/script";

import { integrations } from "@/lib/env";

/**
 * Google Analytics 4 loader.
 *
 * Renders nothing unless NEXT_PUBLIC_GA_MEASUREMENT_ID is set at build time, so
 * the site ships no third-party script by default and no fabricated ID can leak
 * into production. In the EEA/UK, a consent management platform must be added
 * and must gate this script before it is enabled for real traffic.
 */
export function Analytics() {
  if (!integrations.gaMeasurementId) return null;
  const id = integrations.gaMeasurementId;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}
