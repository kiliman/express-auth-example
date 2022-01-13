import {
  ActionFunction,
  LoaderFunction,
  Form,
  Link,
  MetaFunction,
  redirect,
} from 'remix'

export let loader: LoaderFunction = () => {
  return redirect('/login', {
    headers: {
      'set-cookie': 'auth=; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    },
  })
}

export let action: ActionFunction = () => {
  return redirect('/', {
    headers: {
      'set-cookie': 'auth=; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    },
  })
}

export default function () {
  return null
}
