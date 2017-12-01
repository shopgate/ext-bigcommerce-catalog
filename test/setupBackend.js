const Module = require('module')
const path = require('path')
const process = require('process')

const extensionModulesPath = path.dirname(__dirname) + '/extension/node_modules'

process.env['NODE_PATH'] = extensionModulesPath
process.env['JUNIT_REPORT_PATH'] = '../build/mocha.xml'
process.env['JUNIT_REPORT_STACK'] = 1

Module._initPaths()

