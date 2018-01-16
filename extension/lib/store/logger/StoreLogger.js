class StoreLogger {
  /**
   * @param {LoggerContextLog} context
   */
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
    const duration = endTime - startTime
    return {duration: duration, description: description}
  }

  startTimer () {
    this._startTime = new Date()
  }

  /**
   * @param {string} description
   */
  logTime (description) {
    this._context.log.info(this._createTimeLongMetaObject(this._startTime, new Date(), description), 'BigCommerce API Call Time Measurement')
  }
}

module.exports = StoreLogger
