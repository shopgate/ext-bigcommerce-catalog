const Module = require('module')
const path = require('path')
const process = require('process')
const fs = require('fs')

const extensionModulesPath = path.dirname(__dirname) + '/extension/node_modules'
const integrationTestCredentialFile = path.dirname(__dirname) + '/.integration-credentials.js'

process.env['NODE_PATH'] = extensionModulesPath
process.env['JUNIT_REPORT_PATH'] = '../build/mocha.xml'
process.env['JUNIT_REPORT_STACK'] = 1

fs.writeFile(integrationTestCredentialFile, 'module.exports = {\n' +
  '  clientId: \'***\',\n' +
  '  accessToken: \'***\',\n' +
  '  storeHash: \'***\'\n' +
  '}', {flag: 'wx'}, function (err) {
  if (err) {
    return true
  }
})

Module._initPaths()
