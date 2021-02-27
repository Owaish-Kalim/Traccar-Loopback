// here write all third party services ex: traccer api call
/**
 * @author Ragini Sahu <ragini.sahu@eulogik.com>
 */
const config = require("../traccar-config.json"); // traccar credentials
const axios = require('axios'); // for traccar api call
const auth = require('./auth.js');


exports.createDevice = (data) => { 
  var response
  const url = `${config.url}devices`
  const token = auth.tok()
  response = axios.post(url, data, { headers: {'Authorization': `Basic ${token}`}})
  .then((res) => {
    // console.log('Response Data:', res.data); 
    // console.log(res.data.lastUpdate)
    //  res.data.lastUpdate.toISOString();
    return res.data 
  })
  .catch((error) => {
    console.log(error.response.data)
    return error.response.data
  }) 
  return response 
}

exports.getDevices =  () => {
  var response
  const url = `${config.url}devices`
  const token = auth.tok()
  response =   axios.get(url, { headers: {'Authorization': `Basic ${token}`}})
  .then((res) => {
    return res.data
  })
  .catch((error) => {
    console.log(error.response.data)
    return error.response.data
  }) 
  return response
}

exports.getDeviceById =  (Id) => {
  var response
  const url = `${config.url}devices/${Id}`
  const token = auth.tok()
  response =   axios.get(url, { headers: {'Authorization': `Basic ${token}`}})
  .then((res) => {
    // console.log(res.body) 
    return res.data
  })
  .catch((error) => {
    console.log(error.response.data)
    return error.response.data
  }) 
  return response
}

exports.updateDevice = (data) => { 
  var response
  const Id = data.id
  const url = `${config.url}devices/${Id}`
  const token = auth.tok()
  
  response = axios.put(url, data, { headers: {'Authorization': `Basic ${token}`}})
  .then((res) => {
    console.log('Response Data:', res.data); 
    return res.data 
  })
  .catch((error) => {
    console.log(error.response.data)
    return error.response.data
  }) 
  return response 
}

exports.deleteDevice =  (Id) => {
  var response
  const url = `${config.url}devices/${Id}`
  const token = auth.tok()
  response =   axios.delete(url, { headers: {'Authorization': `Basic ${token}`}})
  .then((res) => {
    console.log(res) 
    return "Deleted successfully!"
  })
  .catch((error) => {
    console.log(error.response.data)
    return error.response.data
  }) 
  return response
}

exports.getDevicesLocation =  () => {
  var response
  const url = `${config.url}positions`
  const token = auth.tok()
  response =   axios.get(url, { headers: {'Authorization': `Basic ${token}`}})
  .then((res) => {
    var positions = []  
    for(let i=0; i<res.data.length; i++) {
        positions[i]={latitude : res.data[i].latitude, longitude:res.data[i].longitude}
    }
    console.log('Resoponse Data:', positions);
    return positions
  })
  .catch((error) => {
    console.log(error.response.data)
    return error.response.data
  }) 
  return response
}

exports.getDeviceLocationById =  (Id) => {
  var response
  const url = `${config.url}positions`
  const token = auth.tok()
  response =   axios.get(url, { headers: {'Authorization': `Basic ${token}`}})
  .then((res) => {
    var positions 
      for(let i=0; i<res.data.length; i++) {
          if(Id == res.data[i].deviceId) {
              positions = {latitude : res.data[i].latitude, longitude:res.data[i].longitude} 
              break ;
          }
      }
    console.log('Resoponse Data:', positions);
    return positions
  })
  .catch((error) => {
    console.log(error.response.data)
    return error.response.data
  }) 
  return response
}

exports.getDevicesStatus =  (status) => {
  var response
  const url = `${config.url}devices`
  const token = auth.tok()
  response =   axios.get(url, { headers: {'Authorization': `Basic ${token}`}})
  .then((res) => {
    var positions = []  
      for(let i=0; i<res.data.length; i++) {
          if(status == res.data[i].status) { 
              positions.push(res.data[i]) ; 
          }
      }
    console.log('Resoponse Data:', positions);
    return positions
  })
  .catch((error) => {
    console.log(error.response.data)
    return error.response.data
  }) 
  return response
}

exports.DevicesReports = (req) => { 
  var string = "", response ;
    for(let i=0; i<req.deviceId.length; i++) {
        if(i != 0) string += '&'
        string += 'deviceId=' + req.deviceId[i].toString() ;
    }

    // from and to must be in ISO 8601 format like ('2018-04-23T10:26:00.996Z')

    const url = `${config.url}reports/route?${string}&from=${req.from}&to=${req.to}`
    const token = auth.tok()
    
    response = axios.get(url, { headers: {'Authorization': `Basic ${token}`}})
    .then((res) => { 
      return res.data
    })
    .catch((error) => {
      console.error(error.response.data)
      return error.response.data
    })

  return response 
}