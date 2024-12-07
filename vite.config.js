import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://attendancetracker-backend1.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
};
