require('dotenv').config()
const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const morgan = require('morgan')
const { createRequestHandler } = require('@remix-run/express')

const MODE = process.env.NODE_ENV
const BUILD_DIR = path.join(process.cwd(), 'server/build')

let app = express()
app.use(cookieParser())
app.use(compression())
app.use(morgan('tiny', { skip: (req, res) => req.path === '/health' }))

// You may want to be more aggressive with this caching
app.use(express.static('public', { maxAge: '1h' }))

// Remix fingerprints its assets so we can cache forever
app.use(express.static('public/build', { immutable: true, maxAge: '1y' }))

app.all('*', handleRequest)

let port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Express server listening on http://localhost:${port}`)
})

const getLoadContext = req => ({ auth: req.cookies.auth })

function handleRequest(req, res, next) {
  let build = require('./build')
  if (MODE !== 'production') {
    purgeRequireCache()
  }
  if (requireAuthentication(req)) {
    return unauthenticated(req, res)
  }
  return createRequestHandler({
    build,
    getLoadContext,
    mode: MODE,
  })(req, res, next)
}

////////////////////////////////////////////////////////////////////////////////
function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, we prefer the DX of this though, so we've included it
  // for you by default
  for (let key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key]
    }
  }
}

const allowAnonymous = ['/login', '/logout', '/register']

function requireAuthentication(req) {
  console.log('requireAuthentication', req.originalUrl)
  const url = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`)
  const token = req.cookies.auth ?? req.get('x-token')
  const isAnonymous = !token

  return isAnonymous && !allowAnonymous.includes(url.pathname)
}

function unauthenticated(req, res) {
  const url = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`)
  if (url.pathname.startsWith('/api')) {
    return res.status(401).send('Unauthenticated')
  }

  const isDataRequest = url.searchParams.has('_data')
  if (isDataRequest) url.searchParams.delete('_data')

  const returnUrl = encodeURI(`${url.pathname}${url.search}`)
  const redirectUrl = `/login?returnUrl=${returnUrl}`

  return isDataRequest
    ? // special handling for redirect from data requests
      res.status(204).set('x-remix-redirect', redirectUrl).send()
    : res.redirect(redirectUrl)
}
