/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bleu-nuit': '#0F172A',
        'bleu-secondaire': '#2563EB',
        'cyan-accent': '#38BDF8',
        'succes': '#22C55E',
        'alerte': '#EF4444',
        'fond-clair': '#F8FAFC',
        'texte-sombre': '#1E293B',
      },
    },
  },
  plugins: [],
}