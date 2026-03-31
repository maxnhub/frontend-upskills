const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: [],
  lintOnSave: false,
  devServer: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        pathRewrite: { '^/api': '/api' }
      }
    }
  }
});
