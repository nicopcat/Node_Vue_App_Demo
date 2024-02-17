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
        target: `https://node-vue-app-demo.vercel.app`,
        // target: `http://localhost:3000`,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
  },
})
