'use strict';
const config = require("../../server/traccar-config.json"); // traccar credentials
const axios = require('axios'); 
const deviceDetailsServices = require('../../server/services/reports')

module.exports = function(Reports) {

    Reports.ws = async function(cb) {
        var response = await deviceDetailsServices.reports() 
        cb(null, response)
    }

    Reports.remoteMethod('ws', {
        http: {path: '/ws', verb: 'get'},
        returns: { arg: 'response', type: 'object'}
      });    
    
};
