import './globals.css';

export const metadata = {
  title: 'IQMetry — Tes IQ & Asesmen Kognitif AI',
  description:
    'Platform asesmen kognitif interaktif: tes IQ adaptif dengan skoring psikometri nyata (Mean 100, SD 15), analisis mendalam berbasis Gemini AI, dan sertifikat resmi PNG/PDF.',
  keywords: [
    'tes IQ',
    'asesmen kognitif',
    'IQ test Indonesia',
    'psikometri',
    'Gemini AI',
    'skor IQ',
    'sertifikat IQ',
  ],
  authors: [{ name: 'IQMetry' }],
  openGraph: {
    title: 'IQMetry — Tes IQ & Asesmen Kognitif AI',
    description:
      'Ukur kecerdasan logika, verbal, spasial, dan numerik Anda. Skor IQ realistis + laporan AI mendalam + sertifikat resmi.',
    type: 'website',
    locale: 'id_ID',
  },
};

const themeInit = `
(function () {
  try {
    var stored = localStorage.getItem('iqmetry-theme');
    var theme = stored || 'dark';
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
