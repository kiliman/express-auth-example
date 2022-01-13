import {
  ActionFunction,
  Form,
  json,
  Link,
  MetaFunction,
  redirect,
  useActionData,
} from 'remix'
import { registerUser, userExists } from '~/db/user.server'
import { RemixLogo } from '~/root'

export let meta: MetaFunction = () => {
  return {
    title: 'Register',
  }
}

export let action: ActionFunction = async ({ request }) => {
  const user = Object.fromEntries(new URLSearchParams(await request.text()))
  // check existing
  if (await userExists(user.email)) {
    return json({ error: 'User already exists' })
  }
  user.name = `${user.firstName} ${user.lastName}`

  const newUser = await registerUser(user)
  return redirect('/login')
}

export default function () {
  const data = useActionData()
  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex flex-col flex-1 px-4 py-4 sm:justify-center sm:py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="w-full max-w-sm mx-auto lg:w-96">
          <div>
            <div className="flex items-center">
              <RemixLogo className="w-auto h-12" />
              <h1 className="ml-2 text-3xl font-light uppercase text-primary-900">
                Express Auth
              </h1>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Register new account
            </h2>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <Form replace method="post" className="space-y-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="accept-terms"
                      name="accept-terms"
                      type="checkbox"
                      required
                      className="w-4 h-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
                    />
                    <label
                      htmlFor="accept-terms"
                      className="block ml-2 text-sm text-gray-900"
                    >
                      I accept the{' '}
                      <Link
                        to="/terms"
                        className="font-medium text-primary-600 hover:text-primary-500"
                      >
                        Terms of Service
                      </Link>
                    </label>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Register
                  </button>
                </div>
                {data?.error && (
                  <div className="mt-2 text-red-600">{data.error}</div>
                )}
              </Form>
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex-1 hidden w-0 lg:block">
        <img
          className="absolute inset-0 object-cover w-full h-full"
          src="https://images.unsplash.com/photo-1641730710827-a3305f63c6a2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=4548&q=80"
          alt=""
        />
      </div>
    </div>
  )
}
