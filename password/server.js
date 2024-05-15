// server.js

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express(); 
const port = 10000;

const path = require('path');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,  'build')));

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

////////////////////////////
app.get("/",async(req,res)=>{

    res.sendFile(path.join(__dirname, 'build','index.html'));

});

app.get("/addpassword", async (req, res) => {
    const { recordname, username, password, masterpassword } = req.query;

    const derivekey = crypto.pbkdf2Sync(masterpassword, 'salt', 1000, 32, 'sha256');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', derivekey, iv);
    let encryptedPassword = cipher.update(password, 'utf8', 'hex');
    encryptedPassword += cipher.final('hex');

    const newPass = new pass({
        recordname,
        username,
        password: encryptedPassword,
        masterpassword,
        iv: iv.toString('hex')
    });

    try {
        await newPass.save();
        res.status(200).send('Password added successfully');
    } catch (error) {
        console.error("Error adding password:", error);
        res.status(500).send('Failed to add password. Please try again.');
    }
});

//////////////////////////////////////////////////////////////////
app.get("/fetchdata", async (req, res) => {
    const { recordnameToFetch, masterpasswordToFetch } = req.query;
    console.log({ recordnameToFetch, masterpasswordToFetch });
    const recordname=recordnameToFetch;
    const masterpassword=masterpasswordToFetch

    try {
        const entry = await pass.findOne({ recordname,masterpassword});
        console.log({ entry });

        if (!entry) {
            console.log("Record not found");
            return res.status(404).send("Record not found");
        }

        const deriveKey = crypto.pbkdf2Sync(masterpassword, 'salt', 1000, 32, 'sha256');
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
