// components/GoogleAnalytics.js
import Script from 'next/script';

const GA_TRACKING_ID = 'G-N7E2FM9SLM'; // Replace with your Measurement ID

const GoogleAnalytics = () => (
  <>
    <Script
      async
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
    />
    <Script
      id="google-analytics-init"
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}');
        `,
      }}
    />
  </>
);

export default GoogleAnalytics;
