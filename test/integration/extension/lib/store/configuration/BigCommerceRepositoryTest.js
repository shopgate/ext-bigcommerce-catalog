'use strict'

const Credentials = require('../../../../../../.integration-credentials')
const Factory = require('../../../../../../extension/lib/steps/BigCommerceFactory')
const BigCommerceConfigRepository = require('../../../../../../extension/lib/store/configuration/BigCommerceRepository')
const chai = require('chai')
chai.use(require('chai-as-promised')).should()

const factory = new Factory(Credentials.clientId, Credentials.accessToken, Credentials.storeHash)

describe('BigCommerce store currency configuration', () => {
  it('will return store currency', () => {
    const subjectUnderTest = new BigCommerceConfigRepository(factory.createV2())

    return subjectUnderTest.getCurrency().should.be.fulfilled.and.eventually.equal('USD')
  })
})
