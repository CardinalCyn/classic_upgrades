import { ThemeProvider } from "./providers/theme-provider";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ClassicModeProvider } from "./providers/modeContext";
import "./globals.css";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="wowhead-tooltips" strategy="afterInteractive">
          {`const whTooltips = {colorLinks: true, iconizeLinks: true, renameLinks: true};`}
        </Script>
        <Script
          src="https://wow.zamimg.com/js/tooltips.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${GeistSans.className} ${GeistMono.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClassicModeProvider>{children}</ClassicModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
