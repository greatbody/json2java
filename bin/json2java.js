#!/usr/bin/env node

const path = require('path')
const { loadJSON } = require('../lib/util')
const PackageGen = require('../lib/PackageGen')

const params = process.argv

const targetJSON = loadJSON(path.join(process.cwd(), params[2]))

const targetPG = new PackageGen(params[3], params[4], targetJSON)

targetPG.exportToFS()

console.log('已导出到文件')
