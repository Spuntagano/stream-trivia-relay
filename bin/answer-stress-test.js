const querystring = require('querystring');
const http = require('http');

main();

async function main() {
  for (let i = 0; i < 1000; i++) {
    answer(i, Math.floor(Math.random()*4));
    await sleep(5);
  }
}

async function answer(i, ans) {
  var postData = querystring.stringify({
    'id': i,
    'channel_id': '28477826',
    'answer': ans
  });

  var options = {
    hostname: 'trivia.stream-requests.com',
    port: 8080,
    path: '/answer',
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