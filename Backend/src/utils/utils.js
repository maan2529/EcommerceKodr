const { v4: uuidv4 } = require('uuid');

const createUUID = () =>{
    return uuidv4()
}

module.exports = {
    createUUID
}