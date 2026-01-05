import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // GitHub Pages 部署配置 - 如果你的仓库名是 wardrobe，就改成 '/wardrobe/'
  // 如果是 username.github.io 仓库，就用 '/'
  base: '/wardrobe/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'wardrobe-icon-192.png', 'wardrobe-icon-512.png'],
      manifest: {
        name: '她的衣柜 - 电子衣柜管理',
        short_name: '她的衣柜',
        description: '一个温柔治愈的电子衣柜管理应用',
        theme_color: '#E8B4B8',
        background_color: '#FDF6F0',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'wardrobe-icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'wardrobe-icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'wardrobe-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      }
    })
  ],
})
