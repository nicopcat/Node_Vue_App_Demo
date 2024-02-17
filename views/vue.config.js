const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  outputDir:'dist',
  assetsDir:'static',
  devServer: {
    host: '0.0.0.0',
    open: false,
    proxy: {
      '/api': {
        // target: 'http://localhost:3000',
        target: 'https://node-vue-app-demo.vercel.app:3000',
        changeOrigin: true,
        pathRewrite: {
          '/api': ''
        }
      }
    },
  },
})
