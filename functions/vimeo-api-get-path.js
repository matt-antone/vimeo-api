const Vimeo = require('vimeo').Vimeo;
const fs = require('fs')
const faunadb = require('faunadb')
const q = faunadb.query

require('dotenv').config()

const storeData = async (data, path) => {
    let today = new Date()

    /* configure faunaDB Client with our secret */
    const client = new faunadb.Client({
      secret: process.env.FAUNADB_SERVER_SECRET
    })  
    /* parse the string body into a useable JS object */
    const faunaData = {
      date: today.getTime(),
      path: path,
      data: data,
    }

    console.log(`Function ${'groups'}-create invoked`, faunaData)
    const Item = {
      data: faunaData
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

exports.handler = async function(event, context, callback) {
  console.log(event,context,callback)
  var client = new Vimeo(CLIENT_ID, CLIENT_SECRET);

  return Promise.all(

  )
  let videos
  client.generateClientCredentials(['public'], (err, response) => {
    if (err) {
      throw err;
    }
    var token = response.access_token;
    var scopes = response.scope;
    if(typeof(token) !== 'undefined') {
      client.request({
        path: '/channels/staffpicks/videos',
        query: {
          page: 1,
          per_page: 50,
          fields: 'uri,name,description,duration,created_time,modified_time,pictures'
        }
      }, function (err, body, status_code, headers) {
        if (err) {
          console.log('error');
          console.log(err);
          return err
        } else {
          console.log('body');
          videos = {
            statusCode: 200,
            body: body
          }
          return storeData(videos,'/channels/staffpicks/videos')
        }
      });
    }
  });
}
