// https://gateway.pinata.cloud/ipfs/<metadata-hash-code>
// https://ipfs.io/ipfs/
const express = require('express');
const bodyParser = require('body-parser');

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const port = process.env.PORT || 5000;
const host = process.env.HOST || "http://localhost"
const pinataApiKey = process.env.PinataAPIKey || "5adab11187d1db68e561"
const pinataSecretApiKey = process.env.PinataSecretApiKey || "94c31305d30adffd8fb4eb29f4c5abfd1aade990d3dbf934169bd1a629ef787e"

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

// Write metadata per each image
// const writeMetaData = (_name, _data) => {
//     fs.writeFileSync("./server/arts_metadata/" + _name + ".json", _data);
// };

// Upload art to Pinata
async function upload_art(art_url){
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    //we gather a local file for this example, but any valid readStream source will work here.
    let data = new FormData();
    data.append('file', fs.createReadStream(art_url)); // ./yourfile

    //You'll need to make sure that the metadata is in the form of a JSON object that's been convered to a string
    //metadata is optional
    const metadataImage = JSON.stringify({
        name: 'testname',
        keyvalues: {
            artist: 'walter',
        }
    });
    data.append('pinataMetadata', metadataImage);
    try{
        const resp = await axios.post(url, data, {
            maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataSecretApiKey
            }
        });
        return "https://gateway.pinata.cloud/ipfs/" + resp.data.IpfsHash;
    }catch (err) {
        console.log(err)
    }
        // .then(function (response) {
        //     //handle response here
        //     return "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash;
        // })
        // .catch(function (error) {
        //     //handle error here
        //     return null;
        // });
}
const get_IPFS = async (count) => {
    let results = [];
    
    const files = await fs.readdirSync("./Server/arts_metadata");
    if(files.length >= count)
        for (let i = 0; i < count; i++) {
            if(files[i].includes("pending"))
                continue;
            const URI = await upload_art("./server/arts_metadata/" + files[i]);
            results.push(URI)
            fs.rename("./server/arts_metadata/" + files[i], "./server/arts_metadata/pending_" + files[i], function(err) {
                if ( err ) console.log('ERROR: ' + err);
            });
            //fs.unlinkSync("./server/arts_metadata/" + files[i])
        }

    results.push({art_count: files.length})
    // await fs.readdir("./Server/arts_metadata", function (err, files) {
    //     //handling error
    //     if (err) {
    //         return console.log('Unable to scan directory: ' + err);
    //     } 
    //     //listing all files using forEach
        
    //     (files.length > count) && files.forEach(async function (file, index) {
    //         // Do whatever you want to do with the file
    //         if(count <= (index + 2))
    //             return;
    //         const URI = await upload_art("./server/arts_metadata/" + file);
    //         results.push(URI)
    //     });
    //     console.log(files);
    //     results.push({art_count: files.length})
    // });
    return results
} 
// delete minted metadata
app.post("/delete", async (req, res) => {
    const files = req.body.files
    files && files.length > 0 && files.map((file) => {
        fs.unlinkSync(file)
    })
})
// create a GET route
app.post('/mint', async (req, res) => {

    // -------------------- PS-----------------
    // Art_gernerator generate json meta data with image(art)
    // --------------------------------------

    const count = req.body.count
    
    // file remove 
    // fs.unlinkSync(path)
    // let results = [];
    // for(let i = 0; i < count; i ++) {
    //     const image = await upload_art("./server/arts/1 (1).jpg")
    //     const metadata = {
    //         "description": "Dick opensea Art 1", 
    //         "external_url": "Dick site URL: https://dick....", 
    //         "image": image, 
    //         "name": "Dick 1",
    //         "attributes": [
    //             {
    //                 "trait_type": "Base", 
    //                 "value": "Starfish"
    //             }, 
    //             {
    //                 "trait_type": "Eyes", 
    //                 "value": "Big"
    //             }, 
    //         ], 
    //     }
    //     await writeMetaData("1", JSON.stringify(metadata))
    //     const URI = await upload_art("./server/arts_metadata/1.json");
    //     results.push(URI)
    // }
    const t = await get_IPFS(count)
    res.json({ succees: true, data:  t})
});