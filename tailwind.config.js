/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#F5F3FF',
          primary: '#6366F1',
          dark: '#4338CA',
          accent: '#F59E0B',
        },
        surface: {
          50:  '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          900: '#111827',
        },
        'deep-space':  '#0B0F1A',
        'soft-silk':   '#FFFFFF',
        'sage-green':  '#10B981',
        'muted-slate': '#64748B',
      },
      borderRadius: {
        premium: '1.25rem',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        float: '0 20px 25px -5px rgba(0,0,0,.10), 0 10px 10px -5px rgba(0,0,0,.04)',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui'],
        body:    ['"Inter"',             'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}
