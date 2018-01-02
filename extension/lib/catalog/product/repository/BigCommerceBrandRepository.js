class BigCommerceBrandRepository {
  constructor (apiVersion3Client) {
    this._client = apiVersion3Client
  }

  /**
   * @param {string} brandId
   * @returns {Promise<string>}
   */
  async get (brandId) {
    if (!brandId) {
      return ''
    }
    const response = await this._client.get(
      '/catalog/brands/' + brandId + '?include_fields=name')

    return response.data.name
  }
}

module.exports = BigCommerceBrandRepository
