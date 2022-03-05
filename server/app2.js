const express = require('express');
const fs = require('fs');
const thumbsupply = require('thumbsupply');
const cors = require('cors');
const multer = require('multer')
const { spawn } = require('child_process')
const path = require('path');



const app = express();

app.get('/', (req, res) => {
    // spawn new child process to call the python script
    const python = spawn('python3', ['./app2.py', "Hello man"]);

    // collect data from script
    var out = ""
    let resultError = "";
    python.stdout.on('data', function (data) {

        console.log('Pipe data from python script: ', data.toString());
        out += data.toString();
    });

    python.stderr.on('data', data => {
        console.log(data.toString())
        resultError += data.toString();
    });
    // in close event we are sure that stream from child process is closed
    python.stdout.on('close', code => {
        console.log(`child process close all stdio with code ${code}`);
        //   // send data to browser
        //   // console.log(out)
        //   res.send(out)
        // });

        if (resultError == "") {
            res.send(out);
        } else {

            const error = new Error(resultError);
            console.error(error);
            res.send(error);
        }
    })
})


app.listen(4000, () => {
    console.log('Listening on port 4000!')
})

