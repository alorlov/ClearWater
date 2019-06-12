var express = require('express');
var app = express();

//setting middleware
app.use(express.static(__dirname + '/public')); //Serves resources from public folder
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
})

app.get('/submit2', (req, res) => {
  console.log(req.body);
  res.send('Got ' + req.body)
})

app.post('/api/loadfile', (req, res) => {
  let path = req.body.path
  loadFile(path)
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    console.log(err)
    res.send('ERROR|' + err)
  })
})

app.post('/api/savefile', (req, res) => {
  let path = req.body.path,
      content = req.body.content
  saveFile(path, content)
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    console.log(err)
    res.send('ERROR|' + err)
  })
})

app.post('/api/readdir', (req, res) => {
  let path = req.body.path
  readDir(path)
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    console.log(err)
    res.send('ERROR|' + err)
  })
})

var server = app.listen(5000, () => {
  console.log("Staric content is in " + __dirname + '/public')
});

var fs = require('fs')

function loadFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, file) => {
      if (err) reject("Error on file reading: " + err)
      resolve(file)
    })
  })
}

function readDir(path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) reject("Error on dir reading: " + err)
      resolve(files)
    })
  })
}

function saveFile(path, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, (err) => {
      if (err) reject("Error on file saving: " + err)
      resolve()
    })
  })
}


// loadFile(process.argv[2]).then(data => {
//   console.log(data);
// })
// .catch(err => {
//   console.log(err);
// })
