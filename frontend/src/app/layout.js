import { Roboto_Serif } from "next/font/google";
import "./globals.css";
import Main from "./Main";

const roboto = Roboto_Serif({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"]
})

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.className} font-sans max-w-screen-maxW m-auto box-border bg-gradient-to-r from-[#fbdafc] to-[#b9edf9]`}>
      <Main>{children}</Main>
      </body>
    </html>
  );
}