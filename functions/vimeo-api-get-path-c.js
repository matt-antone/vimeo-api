const faunadb = require('faunadb')
const q = faunadb.query
const fetch = require('node-fetch');
const axios = require('axios');

require('dotenv').config()


exports.handler = async function(event, context, callback) {
  console.log(event,context)
  return getGroup()
}

const getGroup = async function () {

  const x = process.env.VIMEO_CLIENT_ID
  const y = process.env.VIMEO_CLIENT_SECRET
  // const API_ENDPOINT = 'https://api.vimeo.com/channels/staffpicks/videos'
  const API_ENDPOINT = 'https://api.vimeo.com/oauth/authorize/client'

  let response

  const request = {
    url: API_ENDPOINT,
    method: 'post',   
    headers: {          // request headers
      'Authorization':	`basic base64_encode(${x}:${y})`,
      'Content-Type':	'application/json',
      'Accept':	'application/vnd.vimeo.*+json;version=3.4',
      'Transfer-Encoding': 'identity',
    },                  
    data: {
      "grant_type": "client_credentials",
      "scope": "public"
    },
  }

  console.log(request);

  try {
    response = await axios(request);
    console.log(response);
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        data: error
      })
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: response
    })
  }
}


// const storeData = async (data, path) => {
//   let today = new Date()

//   /* configure faunaDB Client with our secret */
//   const client = new faunadb.Client({
//     secret: process.env.FAUNADB_SERVER_SECRET
//   })  
//   /* parse the string body into a useable JS object */
//   const faunaData = {
//     date: today.getTime(),
//     path: path,
//     data: data,
//   }

//   console.log(`Function ${'groups'}-create invoked`, faunaData)
//   const Item = {
//     data: faunaData
//   }
//   /* construct the fauna query */
//   return client.query(q.Create(q.Ref(`classes/${'groups'}`), Item))
//     .then((response) => {
//       console.log('success', response)
//       /* Success! return the response with statusCode 200 */
//       return {
//         statusCode: 200,
//         body: JSON.stringify(response)
//       }
//     }).catch((error) => {
//       console.log('error', error)
//       /* Error! return the error with statusCode 400 */
//       return {
//         statusCode: 400,
//         body: JSON.stringify(error)
//       }
//     })  
// }
