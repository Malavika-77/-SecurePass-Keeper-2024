const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express(); 
const port = 3000;

mongoose.connect("mongodb://localhost:27017/password_manager")
    .then(() => {
        console.log("Connection to password_manager database established");
    })
    .catch((error) => {
        console.log("Connection failed");
    });

const schema = new mongoose.Schema({
    recordname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    masterpassword: {
        type: String
      
    },iv: {
        type: String // Add the IV field to store the initialization vector
    }
});

const pass = mongoose.model("pass", schema);

const path = require('path');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,  'build')));
////////////////////////////
app.get("/",async(req,res)=>{

    res.sendFile(path.join(__dirname, 'build','index.html'));

});
app.post("/add", async (req, res) => {
    const { recordname, username, password, masterpassword } = req.body;

    // Derive encryption key from master password
    const derivekey = crypto.pbkdf2Sync(masterpassword, 'salt', 1000, 32, 'sha256');

    // Generate a random IV (Initialization Vector) for AES encryption
    const iv = crypto.randomBytes(16);

    // Create AES cipher using derived key and IV
    const cipher = crypto.createCipheriv('aes-256-cbc', derivekey, iv);

    // Encrypt the password
    let encryptedPassword = cipher.update(password, 'utf8', 'hex');
    encryptedPassword += cipher.final('hex');

    const newpass = new pass({
        recordname,
        username,
        password: encryptedPassword,
        masterpassword,
        iv: iv.toString('hex') // Store IV as a hexadecimal string
    });

    await newpass.save();
    res.status(200).send('Password added successfully');
});

//////////////////////////////////////////////////////////

app.post("/fetch", async (req, res) => {
    const { recordname1, masterpassword1 } = req.body;
    console.log({ recordname1, masterpassword1 });
    const recordname=recordname1;

    try {
        const entry = await pass.findOne({ recordname});
        console.log({ entry });

        if (!entry) {
            console.log("Record not found");
            return res.status(404).send("Record not found");
        }

        const deriveKey = crypto.pbkdf2Sync(masterpassword1, 'salt', 1000, 32, 'sha256');
        console.log({ deriveKey });

        const decipher = crypto.createDecipheriv('aes-256-cbc', deriveKey, Buffer.from(entry.iv, 'hex'));
        console.log({ decipher });

        let decryptedPassword = decipher.update(entry.password, 'hex', 'utf8');
        decryptedPassword += decipher.final('utf8');
        console.log({ decryptedPassword });

        console.log({ recordname: entry.recordname, username: entry.username, password: decryptedPassword });
        res.status(200).json({ recordname: entry.recordname, username: entry.username, password: decryptedPassword });
    } catch (error) {
        console.error("Error occurred:", error); // Log the error message
        res.status(500).send("Internal Server Error");
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
