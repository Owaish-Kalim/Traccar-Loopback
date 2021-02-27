'use strict';
const config = require("../../server/traccar-config.json"); // traccar credentials
const axios = require('axios'); // for traccar api call
const deviceServices = require('../../server/services/device')
const ObjectsToCsv = require('objects-to-csv');


module.exports = function(Device) {
  // 1. create device endpoint
  Device.add = async function(data ,cb) { 
    console.log("12")
    var res = {}, resp = data 
    res.name = data.name ; res.uniqueId = data.uniqueId ; res.status = data.status ;
    res.disabled = data.disabled ; res.positionId = data.positionId ; res.phone = data.phone ;
    res.model = data.model ; res.contact = data.contact ;

    var response = await deviceServices.createDevice(res)  
    
    resp.deviceId = response.id ;

    const url = config.url1
    axios.post(url, resp)
    .then((res) => {
      // console.log('Resoponse Data:', res.data);
      return res.data 
    })
    .catch((error) => {
      console.error(error)
      return error
    })
    cb(null, resp) 
  }

  Device.remoteMethod('add', {
    accepts: { arg: 'data', type: 'object', http: { source: 'body' }},
    returns: {  arg: 'response', type: 'object', root: true, http: { source: 'body' }}, 
  });


  // 2. get list of devices 
  Device.get = async function(cb) {
    var response = await deviceServices.getDevices() 
    // const csv = new ObjectsToCsv(response);
    // response = await csv.toString() ;
    // cb(null, response , 'application/csv', 'attachment;filename=Data.csv')
    cb(null, response)
  }

  Device.remoteMethod('get', {
    http: {path: '/get', verb: 'get'},
    returns: { arg: 'response', type: 'object'}
    // returns: [
    //   {arg: 'body', type: 'file', root: true},
    //   {arg: 'Content-Type', type: 'string', http: { target: 'header' }},
    //   { arg: 'Content-Disposition', type: 'string', http: { target: 'header' }}
    //   // { arg: 'filename', type: 'string', http: { target: 'header' } }
    // ]
}); 

  // 3. get info of particular devices 
  Device.getByID = async function(Id, cb) { 
    // var response = []
    var res = await deviceServices.getDeviceById(Id) 
    // response.push(res)
    // const csv = new ObjectsToCsv(response);
    // var response = await csv.toString() ;
    // cb(null, response, 'application/octet-stream')
    cb(null, res) 
  }

  Device.remoteMethod('getByID', {
    accepts: [{arg: 'Id', type: 'number', required: true}],
    http: {path: '/getByID', verb: 'get'},
    returns: { arg: 'response', type: 'object'}
    // returns: [
    //   {arg: 'body', type: 'file', root: true},
    //   {arg: 'Content-Type', type: 'string', http: { target: 'header' }}
    // ]
  });


  Device.upd = async function(data, cb) { 
    // 'id' and 'uniqueId' must be required 
    var response = await deviceServices.updateDevice(data) 
    cb(null, response) 
  }

  Device.remoteMethod('upd', {
    http: {path: '/upd', verb: 'put'}, 
    accepts: { arg: 'data', type: 'object', http: { source: 'body' }},
    returns: {  arg: 'response', type: 'object', root: true, http: { source: 'body' }}, 
  });

  Device.delete = async function(Id, cb) {
    var response = await deviceServices.deleteDevice(Id) 
    cb(null, response) 
  }

  Device.remoteMethod('delete', {
    accepts: [{arg: 'Id', type: 'number', required: true}],
    http: {path: '/delete', verb: 'del'},
    returns: { arg: 'response', type: 'string'}
  });

  Device.getLocation = async function(cb) {
    var response = await deviceServices.getDevicesLocation() 
    cb(null, response)
  }

  Device.remoteMethod('getLocation', {
    http: {path: '/getLocation', verb: 'get'},
    returns: { arg: 'response', type: 'object'}
  });

  Device.getLocationById = async function(Id, cb) {
    var response = await deviceServices.getDeviceLocationById(Id) 
    cb(null, response)
  }

  Device.remoteMethod('getLocationById', {
    accepts: [{arg: 'Id', type: 'number', required: true}],
    http: {path: '/getLocationById', verb: 'get'},
    returns: { arg: 'response', type: 'object'}
  });

  Device.getDeviceStatus = async function(status, cb) {
    var response = await deviceServices.getDevicesStatus(status) 
    cb(null, response)
  }

  Device.remoteMethod('getDeviceStatus', {
    accepts: [{arg: 'status', type: 'string', required: true}],
    http: {path: '/getDeviceStatus', verb: 'get'},
    returns: { arg: 'response', type: 'object'}
  });

  Device.getDevicesReports = async function(req, cb) {
    var response = await deviceServices.DevicesReports(req) 
    cb(null, response) 
  }

  Device.remoteMethod('getDevicesReports', {
    accepts: { arg: 'req', type: 'object', http: { source: 'body' }},
    returns: {  arg: 'response', type: 'object', root: true, http: { source: 'body' }}, 
  });

};