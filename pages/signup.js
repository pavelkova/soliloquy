import SIGNUP from 'mutations/Signup.graphql'
export default function Signup() {
  /* return <AuthForm formName='signup' /> */

  return (
    /* <div>{ password }</div> */
    <p>hello</p>
  )
}

export const getServerSideProps = async ctx => {
  console.log('SIGNUP PAGE -> GET SSR PROPS ->')
  const { data, error } = await ssrQuery(ctx, CURRENT_USER)
  return { props: { today: todayEntry, error } }
}
