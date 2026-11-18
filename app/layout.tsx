import type { Metadata } from "next";
import RootWrapper from "@/components/RootWrapper";

export const metadata: Metadata = {
  title: "HealthSpace OS - Reception Dashboard",
  description: "Medical Reception Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com"></script>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html {
            scroll-behavior: smooth;
          }
          body {
            font-family: 'Inter', sans-serif;
            background-color: #ffffff;
            color: #1f2937;
            line-height: 1.6;
          }
          h1, h2, h3, h4, h5, h6 {
            font-family: 'Playfair Display', serif;
            font-weight: 600;
          }
          a {
            color: inherit;
            text-decoration: none;
          }
          button {
            font-family: 'Inter', sans-serif;
          }
          input, textarea, select {
            font-family: 'Inter', sans-serif;
          }
        `}</style>
      </head>
      <body>
        <RootWrapper>
          {children}
        </RootWrapper>
      </body>
    </html>
  );
}
