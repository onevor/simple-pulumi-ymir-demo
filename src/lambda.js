const { Dynamo } = require('@onevor/aws-dynamo-db');

/**
 * A very simple body parser for AWS Lambda;
 */
function parseBody(event) {
  const { body, isBase64Encoded } = event;
  const bodyParsed = isBase64Encoded 
    ? JSON.parse(Buffer.from(body, 'base64').toString())
    : body;

  return bodyParsed || {};
}

function dataValidateParse(data) {
  const hasId = Object.prototype.hasOwnProperty.call(data, 'userId');
  const hasName = Object.prototype.hasOwnProperty.call(data, 'name');

  if (!hasId || !hasName) {
    return false;
  }

  return {
    userId: data.userId.toString(),
    name: data.name.toString(),
  };
}

const response = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body),
});

async function handlePost(db, data) {
  // Post a new user record to DynamoDB
  const [errorPut, resultPut] = await db.put(data);
  if (errorPut) {
    console.error('Failed to put item: ', errorPut);
    return response(500, {
      message: 'Failed to put item',
    });
  }

  return response(200, {
    message: 'Created item',
  });
}

async function handleGet(db, data) {
  const hasId = Object.prototype.hasOwnProperty.call(data, 'userId');
  if (!hasId) {
    return response(500, {
      message: 'Invalid input',
    });
  }
  // Get a user record from DynamoDB
  const [errorGet, resultGet] = await db.get({ userId: data.userId.toString() });
  if (errorGet) {
    console.error('Failed to get item: ', errorGet);
    return response(500, {
      message: 'Failed to get item',
    });
  }

  return response(200, {
    data: resultGet,
  });
}

exports.handler = async (event, context) => {
  const { httpMethod, queryStringParameters } = event;

  const config = {
    name: 'lambda',
    region: process.env.REGION,
    hashKey: 'userId',
    rangeKey: 'name',
    tableName: process.env.TABLE_NAME,
  }
  const db = new Dynamo(config);

  if (httpMethod === 'POST') {
    const data = parseBody(event);
    const dataValidated = dataValidateParse(data);
    
    if (!dataValidated) {
      return response(500, {
        message: 'Invalid input',
      });
    }

    return handlePost(db, dataValidated);
  }
  
  if (httpMethod === 'GET') {
    return handleGet(db, queryStringParameters);
  }
};