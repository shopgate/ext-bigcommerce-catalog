const CURRENCY = 'currency'

class BigCommerceRepository {
  /**
   * @param {BigCommerce} apiVersion2Client - V2 client
   */
  constructor (apiVersion2Client) {
    this._client = apiVersion2Client
    this._configuration = []
  }

  /**
   * @returns {Promise<string>}
   */
  async getCurrency () {
    if (!this._configuration[CURRENCY]) {
      const response = await this._client.request('get', '/store')
      this._configuration[CURRENCY] = response.currency
    }

    return this._configuration[CURRENCY]
  }
}

module.exports = BigCommerceRepository
