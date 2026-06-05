import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "کدآموز | یادگیری کدنویسی به فارسی",
  description: "پلتفرم آموزش برنامه‌نویسی برای دانش‌آموزان ایرانی",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="font-[family-name:var(--font-vazirmatn)] antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
