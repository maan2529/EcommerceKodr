const  ImageKit = require("imagekit");
const { createUUID } = require("../utils/utils")

const imagekit = new ImageKit({
    publicKey: process.env.PUBLIC_KEY,
    privateKey : process.env.PRIVATE_KEY,
    urlEndpoint : process.env.URL_ENDPOINT
});  

async function uploadFile(file){
   const result = await imagekit.upload({
    file,
    fileName: createUUID()
   })
   return result;
}

module.exports = uploadFile