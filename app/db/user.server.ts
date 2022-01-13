import util from 'util'
import crypto from 'crypto'

const keylen = 64
const digest = 'sha512'

const pbkdf2 = util.promisify(crypto.pbkdf2)

const secret = process.env.AUTH_SECRET

function createDigest(encodedData: string) {
  return crypto
    .createHmac('sha256', secret!)
    .update(encodedData)
    .digest('base64')
}

function encode(sourceData: any) {
  const json = JSON.stringify(sourceData)
  const encodedData = Buffer.from(json).toString('base64')
  console.log('encode', `${encodedData}!${createDigest(encodedData)}`)
  return `${encodedData}!${createDigest(encodedData)}`
}

function decode(value: string) {
  let [encodedData, sourceDigest] = value.split('!')
  if (!encodedData || !sourceDigest) throw new Error(`invalid value: ${value}`)
  const json = Buffer.from(encodedData, 'base64').toString('utf8')
  const decodedData = JSON.parse(json)
  const checkDigest = createDigest(encodedData)
  const digestsEqual = crypto.timingSafeEqual(
    Buffer.from(sourceDigest, 'base64'),
    Buffer.from(checkDigest, 'base64'),
  )
  if (!digestsEqual) throw new Error('invalid value(s)')
  return decodedData
}

export async function userExists(email: string) {
  return false
}

export async function registerUser(user: any) {
  if (await userExists(user.email)) return null

  const iterations = 10000
  const salt = crypto.randomBytes(20).toString('hex')
  const key = await pbkdf2(user.password, salt, iterations, keylen, digest)
  const hash = key.toString('hex')
  delete user.password
  delete user.confirmPassword
  delete user['accept-terms']
  user.hashedPassword = `${digest}:${iterations}:${keylen}:${salt}:${hash}`

  const { firstName, lastName, email } = user
  return { firstName, lastName, email }
}

export async function getUserById(id: number) {
  return { id, firstName: 'John', lastName: 'Doe', email: 'jdoe@example.com' }
}

export async function getUser(email: string) {
  return {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'jdoe@example.com',
  }
}

export async function verifyUser(email: string, password: string) {
  return true
}

export function getTokenForUser(email: string) {
  return encode({ email })
}

export async function getUserFromToken(token: string) {
  if (!token) {
    throw new Response('Unauthorized', { status: 401 })
  }
  const { email } = decode(token)
  //@ts-ignore
  const { hashedPassword, ...user } = await getUser(email)
  return user
}
