const querystring = require('querystring');
const http = require('http');

main();

async function main() {
  for (let i = 0; i < 1000; i++) {
    join(i);
    await sleep(5);
  }
}

async function join(i) {
  var postData = querystring.stringify({
    'id': i,
    'channel_id': '28477826'
  });

  var options = {
    hostname: 'trivia.stream-requests.com',
    port: 8080,
    path: '/join',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
  };

  var req = http.request(options, (res) => {
    //console.log('statusCode:', res.statusCode);

    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });

  req.on('error', (e) => {
    console.error(e);
  });

  req.write(postData);
  req.end();
}

function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}