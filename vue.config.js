
process.env.VUE_APP_VERSION = (require('./package.json').version) + '-' + (+new Date).toString(Math.floor(Math.random() * (5)) + 32).slice(-8)
module.exports = {
  
}

