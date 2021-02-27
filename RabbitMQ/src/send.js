#!/usr/bin/env node
// rabbitMQ username = guest, password = guest

var amqp = require('amqplib/callback_api');
const axios = require('axios'); 

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    // connection.createChannel(function(error1, channel) {
    //     if (error1) {
    //         throw error1;
    //     }

    //     var queue = 'hello';
    //     var msg = 'Hello World!';

    //     channel.assertQueue(queue, {
    //         durable: false
    //     });
    //     channel.sendToQueue(queue, Buffer.from(msg));

    //     console.log(" [x] Sent %s", msg);
    // });
    setInterval(function() {
        // connection.close();
        // process.exit(0);   
        connection.createChannel(async function(error1, channel) {
            if (error1) {
                throw error1;
            }
    
            var queue = 'hello';
            var msg = 'Hello World!'
            var data ;
            
            const url = 'http://localhost:3000/api/DeviceDetails/reports?Id=1'
            data =  await axios.get(url)
            .then((res) => {  
                return res.data
            })
            .catch((error) => {
                console.log(error.response.data)
                return error.response.data
            }) 
    
            channel.assertQueue(queue, {
                durable: false
            });
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
    
            console.log(" [x] Sent %s", data);
        }); 
    }, 5000);
});