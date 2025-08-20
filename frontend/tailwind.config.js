// tailwind.config.mjs
import scrollbarHide from 'tailwind-scrollbar-hide'; // Import the plugin

export default {
    theme: {
      extend: {
        colors: {
          customPink: '#EADDF1',
          customGreen: '#00FFA1',
        },
      },
    },
    plugins: [
    scrollbarHide, // Use the imported plugin directly
  ],
  }
  