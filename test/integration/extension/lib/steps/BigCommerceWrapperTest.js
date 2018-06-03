const Credentials = require('../../../../../.integration-credentials')
const Factory = require('../../../../../extension/lib/steps/BigCommerceFactory')
const sinon = require('sinon')

describe('Cache Configuration', () => {
  describe('Cache on', () => {
    it('does use the Cache', async () => {
      const storage = {
        get: (key) => {return new Promise((resolve, reject) => { resolve({})})},
        set: (key, value) => {return new Promise((resolve, reject) => { resolve({})})}
      }
      const cacheConfig = {cacheLifetime: 30, extensionStorage: storage}
      const factory = new Factory(Credentials.clientId, Credentials.accessToken, Credentials.storeHash, cacheConfig)
      const wrapper = factory.createV3()
      const getSpy = sinon.spy(storage, 'get')
      const setSpy = sinon.spy(storage, 'set')
      const type = 'get'
      const path = '/catalog/categories/19'
      const data = {}

      const response = await wrapper.request(type, path, data)

      return response.should.have.property('data')
        && getSpy.calledOnce.should.equal(true)
        && setSpy.calledOnce.should.equal(true)

    })
  })

  describe('Cache off', () => {
    it('does not use the Cache', async () => {
      const storage = {
        get: (key) => {return new Promise((resolve, reject) => { resolve({})})},
        set: (key, value) => {return new Promise((resolve, reject) => { resolve({})})}
      }
      const cacheConfig = {cacheLifetime: null, extensionStorage: storage}
      const factory = new Factory(Credentials.clientId, Credentials.accessToken, Credentials.storeHash, cacheConfig)
      const wrapper = factory.createV3()
      const getSpy = sinon.spy(storage, 'get')
      const setSpy = sinon.spy(storage, 'set')
      const type = 'get'
      const path = '/catalog/categories/19'
      const data = {}

      const response = await wrapper.request(type, path, data)

      return response.should.have.property('data')
        && getSpy.calledOnce.should.equal(false)
        && setSpy.calledOnce.should.equal(false)

    })
  })

  describe('Cache undefined', () => {
    it('does not use the Cache', async () => {
      const storage = {
        get: (key) => {return new Promise((resolve, reject) => { resolve({})})},
        set: (key, value) => {return new Promise((resolve, reject) => { resolve({})})}
      }
      const cacheConfig = {}
      const factory = new Factory(Credentials.clientId, Credentials.accessToken, Credentials.storeHash, cacheConfig)
      const wrapper = factory.createV3()
      const getSpy = sinon.spy(storage, 'get')
      const setSpy = sinon.spy(storage, 'set')
      const type = 'get'
      const path = '/catalog/categories/19'
      const data = {}

      const response = await wrapper.request(type, path, data)

      return response.should.have.property('data')
        && getSpy.calledOnce.should.equal(false)
        && setSpy.calledOnce.should.equal(false)

    })
  })
})
