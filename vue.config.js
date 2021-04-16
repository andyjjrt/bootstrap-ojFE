module.exports = {
    devServer: {
      proxy: {
        '/api': { 
          target: 'https://oj.mozix.ebg.tw/api/', 
          changeOrigin: true,
          secure: false,
          pathRewrite: {
            "^/api": ""
          }
        },
        '/public': { 
          target: 'https://oj.mozix.ebg.tw/public/', 
          changeOrigin: true,
          secure: false,
          pathRewrite: {
            "^/public": ""
          }
        },
      }
    }
  }