const faunadb = require('faunadb')
const q = faunadb.query
var rp = require('request-promise');

require('dotenv').config()


exports.handler = async function(event, context, callback) {
  console.log(event,context)
  var options = {
    method: 'POST',
    uri: 'http://api.posttestserver.com/post',
    body: {
        some: 'payload'
    },
    json: true // Automatically stringifies the body to JSON
  };
  try {
    rp(options)
    .then(function (parsedBody) {
        console.log(parsedBody);
    })  
  } catch(err) {
    console.loo(err)
  }
}

