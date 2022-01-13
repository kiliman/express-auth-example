import { LoaderFunction, Link, useLoaderData, json } from 'remix'
import { getUserFromToken } from '~/db/user.server'

export let loader: LoaderFunction = async ({ context }) => {
  const user = await getUserFromToken(context.auth)
  return json({ user })
}

export default function Index() {
  const { user } = useLoaderData()
  return (
    <>
      <h1>Profile {user.firstName}!</h1>
      <div className="flex gap-8">
        <Link className="text-blue-500 hover:underline" to="/">
          Home
        </Link>
        <Link className="text-blue-500 hover:underline" to="profile">
          Profile
        </Link>
      </div>
    </>
  )
}
