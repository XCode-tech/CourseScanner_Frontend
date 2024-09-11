
import Head from 'next/head';

export default function Meta({ title, description, keywords, imageUrl, pageUrl }) {
  return (
    <Head>
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Your Company Name" />
      <meta name="robots" content="index, follow" />
      <meta name="google-site-verification" content="your-google-verification-code" />

      <title>{title}</title>

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl || "https://yourwebsite.com/default-image.jpg"} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content="website" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl || "https://yourwebsite.com/default-image.jpg"} />

      <link rel="canonical" href={pageUrl} />

      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
