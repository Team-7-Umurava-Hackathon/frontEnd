"use client";

import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/500.css";
import "@fontsource/work-sans/600.css";
import "@fontsource/work-sans/700.css";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}