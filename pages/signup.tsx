import { useRouter } from 'next/router'
import { SignupForm } from 'components/SignupForm'
export { getServerSideProps } from 'lib/ssr/require-no-auth'

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
