/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'

export default {
  theme: {
    extend: {
      colors: {
        primary: { ...colors.purple, DEFAULT: colors.purple[600] }
      }
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        md: '2rem',
        lg: '2.5rem'
      }
    }
  },
  plugins: []
}
