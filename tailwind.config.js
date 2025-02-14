/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Correctly specifying JSX/TSX support
  ],

  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#8C2A8D",
          "secondary": "#8C2A8D",
          "accent": "#AC83CF",
          "neutral": "#18191F",
          "base-100": "#F3F2F7",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
      'light', // Ensuring the default 'light' theme is included
    ],
  },
  theme: {
    extend: {
      colors: {
        primary: "#8C2A8D",
        secondary: "#381952",
        themeBlack: "#18191F",
        primaryLight: "#7E6E8C",
        iconFooter: "#CAC2D1",
        iconFooterBg: "#644C79",
        primaryMediumLight: "#AC83CF",
        primaryDark: "#92278F",
        primaryInputBorder: "#E1D9E9",
        primaryGrey: "#F3F2F7",
        purpleLight: "#EFE8F5",
      },
      fontFamily: {
        'barlow': ['Barlow', 'sans-serif'],
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(to right, #7E6E8C 100%, #8C2A8D 100%)',
        'active-gradient': 'linear-gradient(113.51deg, #8C2A8D 44.17%, #BA88BE 85.97%, #8C2A8D 86.48%)',
      },
      boxShadow: {
        'custom': '0px -3px 5px 0px #0000001A',
      },
    },
  },
}
