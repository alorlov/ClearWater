var express = require('express');
var app = express();

//setting middleware
app.use(express.static(__dirname + '/public')); //Serves resources from public folder
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/submit2', (req, res) => {
  console.log(req.body);
  res.send('Got ' + req.body)
})
app.post('/submit', (req, res) => {
  let path = req.body.path
  let data = readDir(path)
  res.send(data)
})

var server = app.listen(5000, () => {
  console.log("Staric content is in " + __dirname + '/public')
});

var fs = require('fs')

function load(filePath) {
  return fs.readFileSync('./public/' + filePath)
}

function readDir(path) {
  fs.readdir(path, (err, files) => {
    if err throw Error("Error on dir reading " + err)

    return files
  })
}
