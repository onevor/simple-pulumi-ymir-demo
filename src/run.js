const { config } = require('dotenv');
const { handler } = require('./lambda');

config();

const eventGet = {
  httpMethod: 'GET',
  queryStringParameters: {
    userId: 123,
  },
};

const postRecord = JSON.stringify({
  userId: '1234',
  name: 'Odin',
});
const base64Payload = Buffer.from(postRecord).toString('base64');

const eventPost = {
  httpMethod: 'POST',
  body: base64Payload,
  isBase64Encoded: true,
};

const context = {};

async function main(event, ctx) {
  const result = await handler(event, ctx);
  console.log(result);
}

main(eventGet, context);