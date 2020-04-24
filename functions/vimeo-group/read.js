/* Import faunaDB sdk */
const faunadb = require('faunadb')
const getId = require('./utils/getId')
const q = faunadb.query

require('dotenv').config()

exports.handler = (event, context) => {
  /* configure faunaDB Client with our secret */
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  }) 
  const id = getId(event.path)
  console.log(`Function '${'groups'}-read' invoked. Read id: ${id}`)
  return client.query(q.Get(q.Ref(`classes/${'groups'}/${id}`)))
    .then((response) => {
      console.log('success', response)
      return {
        statusCode: 200,
        body: JSON.stringify(response)
      }
    }).catch((error) => {
      console.log('error', error)
      return {
        statusCode: 400,
        body: JSON.stringify(error)
      }
    })
}
