/** @type {import('tailwindcss').Config} */
export default {
  // The 'content' array tells Tailwind CSS where to look for class names.
  // It will scan all .html, .js, .ts, .jsx, and .tsx files in the specified paths.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  // The 'theme' object is where you can customize Tailwind's default design system.
  // 'extend' allows you to add new values without overwriting the defaults.
  theme: {
    extend: {},
  },

  // The 'plugins' array is where you can add official or third-party Tailwind plugins.
  plugins: [],
}
