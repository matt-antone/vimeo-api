const faunadb = require('faunadb')
const q = faunadb.query
const fetch = require('node-fetch');

require('dotenv').config()

exports.handler = async function(event, context, callback) {
  console.log(event,context)
  const x = VIMEO_CLIENT_ID
  const y = VIMEO_CLIENT_SECRET
  const API_ENDPOINT = 'https://api.vimeo.com/channels/staffpicks/videos'
  const options = {
      // These properties are part of the Fetch Standard
      method: 'GET',
      headers: {          // request headers
        'Authorization':	`basic base64_encode(${x}:${y})`,
        'Content-Type':	'application/json',
        'Accept':	'application/vnd.vimeo.*+json;version=3.4'
      },                  
      body: {             // request body
        "grant_type": "client_credentials",
        "scope": "public"
      },         
      redirect: 'follow', // set to `manual` to extract redirect headers, `error` to reject redirect
      signal: null,       // pass an instance of AbortSignal to optionally abort requests
  
      // The following properties are node-fetch extensions
      follow: 20,         // maximum redirect count. 0 to not follow redirect
      timeout: 0,         // req/res timeout in ms, it resets on redirect. 0 to disable (OS limit applies). Signal is recommended instead.
      compress: true,     // support gzip/deflate content encoding. false to disable
      size: 0,            // maximum response body size in bytes. 0 to disable
      agent: null         // http(s).Agent instance or function that returns an instance (see below)
  }

  let login
  try {
    login = await fetch(API_ENDPOINT,options)
    // handle response
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({
        error: err.message
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
