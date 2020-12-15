import { ssrRequireAuth } from 'lib/auth-check'
import { SettingsForm } from 'components/SettingsForm'

export default function Settings({ user }) {
  console.log(user)
  return (
    <>
      <SettingsForm props={ user.settings } />
    </>
  )
}

export const getServerSideProps = async ctx => {
  const props = {}

  const { user } = await ssrRequireAuth(ctx)
  if (user) props.user = user

  return { props }
}
