const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    open: false,
    proxy: {
      '/api': {
        target: `https://node-vue-app-demo.vercel.app/`,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    },
  },
})
