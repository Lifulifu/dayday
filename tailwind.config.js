module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ["'montserrat'", 'sans-serif'],
      },
      // animation: {
      //   'left-in': 'left_in 500ms cubic-bezier(0, 0, 0, 0.95) forward',
      //   'left-out': 'left_out 500ms cubic-bezier(0, 0, 0, 0.95) forward',
      //   'right-in': 'right_in 500ms cubic-bezier(0, 0, 0, 0.95) forward',
      //   'right-out': 'right_out 500ms cubic-bezier(0, 0, 0, 0.95) forward'
      // },
      // keyframes: {
      //   left_in: {
      //     0% {
      //       transform: translateX(-70%);
      //       opacity: 0;
      //     }
      //     100% {
      //       transform: translateX(0);
      //       opacity: 1;
      //     }
      //   }
      // }
    },
  },
  plugins: [],
}
