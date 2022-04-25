
process.env.VUE_APP_VERSION = (require('./package.json').version)
process.env.VUE_APP_HASH = (+new Date).toString(Math.floor(Math.random() * (5)) + 32).slice(-8)
const API_BACKEND = "http://localhost:55688"
module.exports = {
    devServer: {
        proxy: {
            '^/api': {
                target: API_BACKEND,
            },
            '^/public': {
                target: API_BACKEND,
            }
        }
    }
}

