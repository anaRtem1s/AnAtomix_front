import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.VITE_API_PORT || 8081}`, // BACKEND EXPRESS PORT
        changeOrigin: true,
      },
    },
  },
})




//? TO DISABLE CORS FOR THIRD PARTY API, SEE IF NEEDED, SAME AS UPSTAIRS BUT EXPORTS DEFAULT

// export default {
//   server: {
//     proxy: {
//       '/api': 'http://localhost:3001'
//     }
//   }
// }



