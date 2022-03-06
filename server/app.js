const express = require('express');
const fs = require('fs');
const thumbsupply = require('thumbsupply');
const cors = require('cors');
var bodyParser = require('body-parser');
const multer = require('multer')
const { spawn } = require('child_process')
const path = require('path');
// for parsing application/json


const app = express();
app.use(bodyParser.json());


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'videos/')
  },
  filename: (req, file, cb) => {
    filename = file.originalname
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

getVideos = (subdir) => {
  let videos1 = []
  const dir = path.join(__dirname, subdir);
  try {
    const files = fs.readdirSync(dir);
    id = 0
    files.forEach(file => {
      const vinfo = {
        id: id,
        poster: `poster/${subdir}/${file}`,
        name: file
      }
      videos1.push(vinfo)
      id++
    });
  }
  catch (err) {
    console.log(err);
  }
  return videos1
}




getVelocity = (filename, res) => {
  // spawn new child process to call the python script
  const python = spawn('python3', ['./app2.py', filename]);
  console.log("Processing")

  // collect data from script
  var out = ""
  let resultError = "";
  python.stdout.on('data', function (data) {
    console.log(data.toString());
    out += data.toString();
  });

  python.stderr.on('data', data => {
    console.log(data.toString())
    resultError += data.toString();
  });
  // in close event we are sure that stream from child process is closed
  python.stdout.on('close', code => {
    console.log("****************************************************")
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
      res.status(400).send(error);
    }
  })
}


app.use(cors());

app.get('/', (req, res) => {
})

app.post('/video', upload.single('file'), function (req, res) {
  getVelocity(req.file.filename, res);
})

app.get('/esavedvideo/:id', function (req, res) {
  console.log(req.params);
  getVelocity(req.params.id, res);
})

app.post('/savevideo', upload.single('file'), function (req, res) {
  res.send("Video saved to server");
})


// endpoint to fetch all videos metadata
app.get('/evideos', function (req, res) {
  var videos = getVideos("assets")
  res.json(videos);
});

app.get('/svideos', function (req, res) {
  var videos11 = getVideos("videos")
  res.json(videos11);
});

app.get('/poster/:id/:id1', function (req, res) {
  thumbsupply.generateThumbnail(`${req.params.id}/${req.params.id1}`)
    .then(thumb => res.sendFile(thumb))
    .catch(err => console.log(err))
});

// endpoint to fetch a single video's metadata



app.get('/video/:id/:id1', function (req, res) {
  const path = `${req.params.id}/${req.params.id1}`;
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    console.log('we have range', range);
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize - 1
    console.log(parts)
    const chunksize = (end - start) + 1
    const file = fs.createReadStream(path, { start, end })
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    console.log('no range', range);
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
});


app.get('/delvideo/:id1/:id2', (req, res) => {

  var path = `./${req.params.id1}/${req.params.id2}`
  try {

    fs.unlinkSync(path)
    res.send("Video deleted")
  } catch (err) {
    console.error(err)
  }
})

app.listen(4000, () => {
  console.log('Listening on port 4000!')
})