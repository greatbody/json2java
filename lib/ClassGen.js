const render = require('./render')
const { typeNameOf, firstCappedWord } = require('./util')
const ejs = require('ejs')
const path = require('path')

class ClassGen {
  constructor (packageName, className, data, taskList) {
    this.packageName = packageName
    this.className = className
    this.imports = []
    this.fields = []
    this.data = data
    this.taskList = taskList
    this.__resolve()
  }

  __resolve () {
    const fieldNames = Object.keys(this.data)
    fieldNames.forEach(fieldName => {
      const fieldData = this.data[fieldName]
      this.fields.push(this.__getAttributeString(fieldName, fieldData))
    })
  }

  __importList () {
    this.__addImportOnce('import java.util.List;')
  }

  __addImportOnce (importDeclare) {
    if (!this.__haveImported(importDeclare)) {
      this.imports.push(importDeclare)
    }
  }

  __haveImported (importDeclare) {
    return this.imports.includes(importDeclare)
  }

  __getNumberType (value) {
    if (value % 1 === 0) {
      return 'int'
    } else {
      return 'float'
    }
  }

  __generatePackageName (attrName, attrData) {
    const classNameOfAttrName = firstCappedWord(attrName)
    const partOfPackageName = this.className.toLowerCase()
    const childPackageName = `${this.packageName}.${partOfPackageName}`
    const importClassOfAttribute = `${childPackageName}.${classNameOfAttrName}`

    const importDeclare = `import ${importClassOfAttribute};`
    if (!this.imports.includes(importDeclare)) {
      this.__addImportOnce(importDeclare)

      this.taskList.push({
        packageName: childPackageName,
        className: classNameOfAttrName,
        data: attrData
      })
    }
    return classNameOfAttrName
  }

  __getAttributeString (attrName, attrData) {
    const attr = []
    const prefixSpace = '  '
    attr.push(`${prefixSpace}@JsonProperty("${attrName}")`)
    const dataType = typeNameOf(attrData)
    switch (dataType) {
      case '[object Object]':
        this.__generatePackageName(attrName, attrData)
        attr.push(
          `${prefixSpace}private ${firstCappedWord(attrName)} ${attrName};`
        )
        break
      case '[object Number]':
        attr.push(
          `${prefixSpace}private ${this.__getNumberType(attrData)} ${attrName};`
        )
        break
      case '[object String]':
        attr.push(`${prefixSpace}private String ${attrName};`)
        break
      case '[object Array]':
        this.__importList()
        if (attrData.length === 0) {
          throw new Error('template json array must have at lease one element!')
        }
        this.__generatePackageName(attrName, attrData[0])
        attr.push(
          `${prefixSpace}private List<${firstCappedWord(attrName)}> ${attrName};`
        )
        break
      case '[object Boolean]':
        attr.push(`${prefixSpace}private boolean ${attrName};`)
        break
    }
    return attr.join('\n')
  }

  __render (data) {
    let outString
    ejs.renderFile(path.join(__dirname, './templates/bean.ejs'), data, (err, result) => {
      if (err) {
        throw err
      }
      outString = result
    })
    return outString
  }

  generateJava () {
    const rendered = this.__render({
      package: this.packageName,
      imports: this.imports.join('\n'),
      className: this.className,
      fields: this.fields
    })
    return {
      package: this.packageName,
      className: this.className,
      raw: rendered
    }
  }
}

module.exports = ClassGen
