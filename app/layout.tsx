// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getUserTheme } from "@/lib/actions/theme";
import { processColorForCSS } from "@/lib/theme-utils";
import "@/app/globals.css";
import { getCurrentUser } from "@/lib/actions/auth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BRDCR",
  description: "Welcome to BRDCR!",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // const theme = await getUserTheme();
  const theme = {
    mode: "system",
    primaryColor: "#3b82f6",
    accentColor: "#8b5cf6",
  };
  const primaryColor = processColorForCSS(theme.primaryColor);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={
        {
          "--user-primary": primaryColor,
        } as React.CSSProperties
      }
    >
      <body className={`${inter.variable} font-inter antialiased`}>
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme={theme.mode}
            enableSystem={theme.mode === "system"}
            disableTransitionOnChange
          >
            <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
            <Toaster
              position="top-center"
              richColors
              expand
              visibleToasts={5}
              gap={12}
              offset={{ top: "20px" }}
              toastOptions={{
                classNames: {
                  toast:
                    "group pointer-events-auto !rounded-xl !border !border-border/50 !bg-background/80 !backdrop-blur-md !shadow-lg",
                  title: "!text-foreground !font-medium font-sans",
                  description: "!text-muted-foreground font-sans",
                },
              }}
            />
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
