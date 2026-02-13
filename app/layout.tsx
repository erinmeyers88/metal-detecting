import type { Metadata } from "next";
import { Geist, Geist_Mono, Oswald, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import ThemeRegistry from "./ThemeRegistry";
import ThemeProviderClient from "./components/ThemeProviderClient";
import ReduxProvider from "./components/ReduxProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Metal Detecting",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sourceSans.variable} ${oswald.variable} antialiased`}
      >
        <ThemeRegistry>
          <ReduxProvider>
            <ThemeProviderClient>
              {children}
            </ThemeProviderClient>
          </ReduxProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
