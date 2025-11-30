/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF",
        accent: "#10B981"
      },
      borderRadius: {
        lg: "1rem",
        md: "0.625rem"
      }
    }
  },
  plugins: []
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E40AF',
        'primary-600': '#2563EB',
        accent: '#10B981',
      },
      borderRadius: {
        '3xl': '1.25rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'card': '0 10px 30px rgba(2,6,23,0.06)',
        'hover': '0 20px 40px rgba(2,6,23,0.08)',
        'soft': '0 6px 18px rgba(2,6,23,0.05)'
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.02', fontWeight: '800' }],
        'h1': ['1.9rem', { lineHeight: '1.08' }],
      }
    }
  },
  plugins: []
};
