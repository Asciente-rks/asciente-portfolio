export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.08), 0 20px 80px rgba(0,0,0,0.35)'
      },
      backgroundImage: {
        'grid-dots': 'radial-gradient(circle at top, rgba(255,255,255,0.06), transparent 25%), linear-gradient(180deg, rgba(255,255,255,0.03), transparent 70%)'
      }
    }
  },
  plugins: []
};
