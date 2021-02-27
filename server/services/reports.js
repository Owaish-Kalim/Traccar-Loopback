const config = require("../traccar-config.json"); // traccar credentials
const axios = require('axios'); // for traccar api call
const WebSocket = require('ws');
const auth = require('./auth.js'); 
var app = require('../server');

exports.reports = async () => {  
    const params = new URLSearchParams()
    params.append('email', config.username)
    params.append('password', config.password) 

    var response
    const url = `${config.url}session`
    const token = auth.tok() 

    response = await axios.post(url, params, { headers: {'Authorization': `Basic ${token}`, 'Content-Type': 'application/x-www-form-urlencoded'}})
    .then((res) => {  
        // console.log(res)
        return res
    })
    .catch((error) => {
        console.log(error)
        return error
    }) 

    const connection = new WebSocket(config.uri, [], {'headers': { 'Cookie': response.headers['set-cookie'][0] }})

    connection.onopen = () => {
        connection.send('Message From Client') 
        console.log("owaish")
    }

    connection.onerror = (error) => {
        console.log('WebSocket error: ${error}')
    }
    connection.onmessage = (e) => {
        console.log(e.data) 
        var received_msg = e.data;
        dataparsed = JSON.parse(received_msg);
        console.log('JSON webSocket-Data', dataparsed) 

        if(dataparsed.hasOwnProperty('positions')) {
          console.log("ok")
        console.log(dataparsed.positions[0].attributes.ip) 
        for(let i=0; i<dataparsed.positions.length; i++) {
            var res = {}, temp = {}
            res.deviceId = dataparsed.positions[i].deviceId ; 
            res.latitude = dataparsed.positions[i].latitude ;
            res.longitude = dataparsed.positions[i].longitude ; 
            res.speed = dataparsed.positions[i].speed ; 
            res.updatedAt = (new Date()).toJSON();

            temp.currentSpeed = dataparsed.positions[i].speed ;
            temp.currentDistance = dataparsed.positions[i].attributes.totalDistance ; 

            // console.log(res) 
            var Device = app.models.device; 
            Device.findOne({where: {deviceId: res.deviceId}}, (err, user) => {
                if (err || !user) {
                  console.log('Something went wrong')
                } else {
                    res.deviceId = user.id 
                    console.log('owaish', user) 
                    
                    // Add the report to the localdb 
                    let url = config.url2
                    axios.post(url, res)
                    .then((res) => {
                    //   console.log('Resoponse Data:', res.data);
                      return res.data 
                    })
                    .catch((error) => {
                      console.error(error)
                      return error
                    }) 


                    // update currentSpeed and currentDistance in Device 
                    url = `${config.url1}/${user.id}`
                    axios.patch(url, temp)
                    .then((res) => {
                      console.log('Resoponse Data:', res.data);
                      return res.data 
                    })
                    .catch((error) => {
                      console.error(error)
                      return error
                    }) 
                }
              })

        }
      }
    }
    connection.onclose = function() { 
        // websocket is closed.
        console.log("Connection is closed..."); 
    };

    return response.data ;
} 