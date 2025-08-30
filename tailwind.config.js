/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",  // <-- this line is very important
    ],
    theme: {
        extend: {
             fontFamily: {
        eczar: ['Eczar', 'serif'], // ✅ add Eczar font
      },
        },
    },
    plugins: [],
};
