var fs = require('fs')
export function testIO() {

  //var fs = require('fs');

  fs.readFile('/cfg/config.ini', (err, data) => console.log(data, err))
  console.log(123);
}
