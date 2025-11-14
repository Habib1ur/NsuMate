import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "NsuMate - University Matrimony",
  description: "Academic-aware matrimony for NSU students"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <div className="min-h-screen flex flex-col">
          <header className="border-b bg-white">
            <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                  N
                </span>
                <span className="font-semibold text-lg">
                  NsuMate
                </span>
              </div>
              <nav className="flex gap-4 text-sm">
                <a href="/browse" className="hover:text-primary-600">
                  Browse
                </a>
                <a href="/matches" className="hover:text-primary-600">
                  Matches
                </a>
                <a href="/messages" className="hover:text-primary-600">
                  Messages
                </a>
                <a href="/dashboard" className="hover:text-primary-600">
                  Profile
                </a>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t bg-white">
            <div className="mx-auto max-w-5xl px-4 py-4 text-xs text-slate-500 flex justify-between">
              <span>© {new Date().getFullYear()} NsuMate</span>
              <span>For NSU students only</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

