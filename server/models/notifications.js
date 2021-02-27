'use strict';
const config = require("../traccar-config.json"); // traccar credentials
const axios = require('axios'); // for traccar api call

module.exports = function(Notifications) {

    Notifications.add = function(data, cb) {
        const url = `${config.url}notifications`
        // console.log(url) 
        const token = Buffer.from(`${config.username}:${config.password}`, 'utf8').toString('base64')
        axios.post(url, data, { headers: {'Authorization': `Basic ${token}`}})
        .then((res) => {
            console.log('Resoponse Data:', res.data);
            cb(null, res.data);
        })
        .catch((error) => {
            console.log(error.response.data)
            cb(error.response.data) 
        }) 
    } 
    
    Notifications.remoteMethod('add', {
        accepts: { arg: 'data', type: 'object', http: { source: 'body' }},
        returns: {  arg: 'response', type: 'object', root: true, http: { source: 'body' }}, 
    });
};