import { Roboto_Serif } from "next/font/google";
import "./globals.css";
import Main from "./Main";

const roboto = Roboto_Serif({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"]
})

export const metadata = {
  title: "DefectLens",
  description: "Elevate Your Code Quality: Smart Defect Detection for Better Maintainability",
  icons: [
    '/icon.png'
  ]
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.className} font-sans h-dvh max-w-screen-maxW m-auto box-border text-[#e3f1f9]`}>
        {/* <body className={`${roboto.className} font-sans max-w-screen-maxW m-auto box-border bg-gradient-to-r from-[#fbdafc] to-[#b9edf9]`}> */}
        <Main>{children}</Main>
      </body>
    </html>
  );
}