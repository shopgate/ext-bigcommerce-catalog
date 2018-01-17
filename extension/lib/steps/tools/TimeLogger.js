class TimeLogger {
 /**
   * @param {BigCommerceWrapperLog[]} logs
   * @param {Object} context
   */
  static log (logs, context) {
    for (let log of logs) {
      context.log.info(log.metaData, log.message)
    }
  }
}

module.exports = TimeLogger
