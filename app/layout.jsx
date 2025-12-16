import './globals.css';

export const metadata = {
  title: 'MyDuit - Smart Family Finance',
  description: 'Aplikasi pengurusan kewangan keluarga Malaysia',
  manifest: '/manifest.json',
  themeColor: '#1e40af',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MyDuit',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ms">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MyDuit" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="bg-slate-50 min-h-screen">{children}</body>
    </html>
  );
}
