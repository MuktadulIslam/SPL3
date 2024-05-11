/** @type {import('tailwindcss').Config} */
module.exports = {
 // module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: "560px",
      md: "800px",
      "2md": "1000px",
      lg: "1200px",
      xl: "1400px",
      "2xl": "1600px",
      maxW: "1800px",
      "max-sm": { max: "559px" },
      "max-md": { max: "799px" },
      "max-2md": { max: "999px" },
      "max-lg": { max: "1199px" },
      "max-xl": { max: "1399px" },
      "max-2xl": { max: "1699px" },
      "zero-sm": { min: "0px", max: "559px" },
      "sm-md": { min: "560px", max: "799px" },
      "md-2md": { min: "800px", max: "999px" },
      "2md-lg": { min: "1000px", max: "1199px" },
      "lg-xl": { min: "1200px", max: "1399px" },
      "xl-2xl": { min: "1400px", max: "1700px" },
    }
  },
  plugins: [],
};
