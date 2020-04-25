exports.handler = async function(event, context, callback) {
  const x = process.env.VIMEO_CLIENT_ID
  const y = process.env.VIMEO_CLIENT_SECRET
  const buff = new Buffer(`${x}:${y}`)
  return buff.toString('base64')
}