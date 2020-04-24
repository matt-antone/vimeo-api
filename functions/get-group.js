const Vimeo = require('vimeo').Vimeo;
const fs = require('fs')

require('dotenv').config()

const storeData = (data, path) => {
    let today = new Date()
    data = {
      path: path,
      data: data,
      date: today.getTime()
    }

    /* configure faunaDB Client with our secret */
    const client = new faunadb.Client({
      secret: process.env.FAUNADB_SERVER_SECRET
    })  
    /* parse the string body into a useable JS object */
    const data = JSON.parse(event.body)
    console.log(`Function ${'groups'}-create invoked`, data)
    const Item = {
      data: data
    }
    /* construct the fauna query */
    return client.query(q.Create(q.Ref(`classes/${'groups'}`), Item))
      .then((response) => {
        console.log('success', response)
        /* Success! return the response with statusCode 200 */
        return {
          statusCode: 200,
          body: JSON.stringify(response)
        }
      }).catch((error) => {
        console.log('error', error)
        /* Error! return the error with statusCode 400 */
        return {
          statusCode: 400,
          body: JSON.stringify(error)
        }
      })  
}

exports.handler = function(event, context, callback) {

  const CLIENT_ID = '72486c8c8352a56c7910ddd11f1fbb33b9b5b9c5';
  const CLIENT_SECRET = 'ujQV7VNMYmz/1HWM7uTmrQJBTLnBl6YGUbU3w4WZScRN16GvyG0rfERlQLa7/so575VAUSpl272JJuKvHZ0G/oG3XpImmnXqf6aJwEdYJHUn8fO8msaL4WPtN0MdALlc';
  const ACCESS_TOKEN = 'XXXXXXXXXX2f79';
  var client = new Vimeo(CLIENT_ID, CLIENT_SECRET);

  let videos
  client.generateClientCredentials(['public'], (err, response) => {
    if (err) {
      throw err;
    }
  
    var token = response.access_token;
    var scopes = response.scope;
    console.log('response',JSON.stringify(response))
    if(typeof(token) !== 'undefined') {
      client.request({
        path: '/channels/staffpicks/videos',
        query: {
          page: 1,
          per_page: 10,
          fields: 'uri,name,description,duration,created_time,modified_time,pictures'
        }
      }, function (err, body, status_code, headers) {
        if (err) {
          console.log('error');
          console.log(err);
          videos = {
            statusCode: err.statusCode || 500,
            body: JSON.stringify({
              error: err.message
            })
          }
        } else {
          console.log('body');
          console.log(body);
          videos = {
            statusCode: 200,
            body: JSON.stringify({
              data: body
            }),
          }

          storeData(videos,'./vidoes.json')
        }
      });
    }
  });
}
