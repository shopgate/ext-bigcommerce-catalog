class StoreLogger {
  constructor (context) {
    this._context = context
    this._startTime = new Date()
  }

  /**
   * @param {Object} metaData
   * @param {string} message
   */
  logInfo (metaData, message) {
    this._context.log.info(metaData, message)
  }

  /**
   * @param {Date} startTime
   * @param {Date} endTime
   * @param {string} description
   * @return {TimeLogMetaData}
   */
  _createTimeLongMetaObject (startTime, endTime, description) {
    let duration = endTime - startTime
    return {duration: duration, description: description}
  }

  startTimmer () {
    this._startTime = new Date()
  }

  logTime (description) {
    this._context.log.info(this._createTimeLongMetaObject(this._startTime, new Date(), description), 'BigCommerce API Call Time Measurement')
  }
}

module.exports = StoreLogger
