import { useRouter } from 'next/router'
import { ssrRequireNoAuth } from 'lib/ssr-auth'
import { SignupForm } from 'components/SignupForm'

export default function Signup() {
  const router = useRouter()
   const props = {
    redirectOnSuccess: (() => {
      router.push('/welcome')
    })
   }
  return (
    <SignupForm {...props } />
  )
}

export const getServerSideProps = async ctx => {
  console.log('GET SSR -> SIGNUP')
  const props = {}
  const { user } = await ssrRequireNoAuth(ctx)

  if (user) props.user = user

  return { props }
}
