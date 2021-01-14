import { ssrRequireAuth } from 'lib/ssr-auth'
import { SettingsForm } from 'components/SettingsForm'

export default function Settings({ user }) {

  const props = user.settings
  return (
    <>
      <SettingsForm { ...props } />
    </>
  )
}

export const getServerSideProps = async ctx => {
  const props = {}

  const { user } = await ssrRequireAuth(ctx)
  if (user) props.user = user

  return { props }
}
