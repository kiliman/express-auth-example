import { createCookieSessionStorage } from 'remix'

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: '__session',
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secrets: ['s3cret1'],
    },
  })

export { getSession, commitSession, destroySession }
