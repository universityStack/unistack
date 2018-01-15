exports.server_port = function () {
    return 3000;
}

exports.gcm = function () {
    return "AIzaSyAZeDhRAPtyOYm_nFryxRlfMI-7-uSMWfo";
}

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'log.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
exports.logla = log4js.getLogger('log');