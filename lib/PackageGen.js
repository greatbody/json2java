const {
  writeFileSync,
  join,
  createFolderRecursive
} = require('./util')
const ClassGen = require('./ClassGen')

class PackageGen {
  constructor (packageName, className, data) {
    this.taskList = [
      {
        packageName,
        className,
        data
      }
    ]
    this.results = []
    this.__resolve()
  }

  __resolve () {
    while (this.taskList.length > 0) {
      const config = this.taskList.pop()
      console.log(`Start ${config.className} of ${config.packageName}...`)
      const classGen = new ClassGen(
        config.packageName,
        config.className,
        config.data,
        this.taskList
      )
      this.results.push(classGen.generateJava())
    }
    return this.results
  }

  exportToFS (baseDir) {
    if (!baseDir) {
      baseDir = process.cwd()
    }
    const results = this.results
    for (let i = 0; i < results.length; i += 1) {
      const result = results[i]
      this.__exportClassToFS(result.package, result.className, result.raw)
    }
  }

  __exportClassToFS (packageName, className, content) {
    const absFolder = join(
      __dirname,
      this.__packageNameToRelativePath(packageName)
    )
    createFolderRecursive(absFolder)
    const absPath = join(absFolder, `${className}.java`)
    writeFileSync(absPath, content)
  }

  __packageNameToRelativePath (packageName) {
    return packageName.split('.').join('/')
  }
}

module.exports = PackageGen
