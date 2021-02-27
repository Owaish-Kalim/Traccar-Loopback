const config = require("../traccar-config.json"); // traccar credentials

exports.tok = () => {
    const token = Buffer.from(`${config.username}:${config.password}`, 'utf8').toString('base64') 
    return token
}