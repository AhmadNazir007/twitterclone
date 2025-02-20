import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        black:"#0F1419",
        dark1:"#17202A",
        dark2:"#1C2733",
        dark3:"#1C2733",
        dark4:"#3A444C",
        dark5:"#5B7083",
        dark6:"#8899A6",
        dark7:"#EBEEF0",
        dark8:"#F7F9FA",
        primary_blue:"#1DA1F2",
        white:"#FFFFFF"
      },
      fontSize:{
        h1:"20px",
        h2:"19px",
        h3:"16px",
        h4:"15px",
        h5:"14px",
        h6:"13px"
      },
      fontFamily:{
        sfcompactM:"SF Compact Display M",
        sfcompactT:"SF Compact Display T"
      },
      fontWeight:{
        scompactweight:"100px"
        
      }
    },
  },
  plugins: [],
} satisfies Config;
