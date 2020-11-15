const fs = require('fs')
const { join, sep } = require('path')

var exports = (module.exports = {})

exports.typeNameOf = function (obj) {
  return Object.prototype.toString.apply(obj)
}

exports.firstCappedWord = function (attrName) {
  return attrName.slice(0, 1).toUpperCase() + attrName.slice(1)
}

exports.writeFileSync = function (path, content) {
  fs.writeFileSync(path, content)
}

exports.loadJSON = function (path) {
  return JSON.parse(fs.readFileSync(path))
}

exports.createFolderRecursive = function (path) {
  if (fs.existsSync(path)) {
    return
  }
  const dirNames = path.split(sep)
  let currDir
  for (let i = 1; i < dirNames.length; i += 1) {
    currDir = dirNames.slice(0, i + 1).join(sep)
    if (!fs.existsSync(currDir)) {
      console.log(`mkdir ${currDir}`)
      fs.mkdirSync(currDir)
    }
  }
}

exports.join = join
