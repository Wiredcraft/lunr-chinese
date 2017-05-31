const lunr = require('lunr')

lunr.trimmer = function (token) {
  return token.replace(/^\s+/, '').replace(/\s+$/, '')
}

lunr.init = function (idx) {
  return lunr.Index.load(idx)
}

lunr.Pipeline.registerFunction(lunr.trimmer, 'trimmer')

module.exports = lunr
