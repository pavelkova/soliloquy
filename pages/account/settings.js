import { SettingsForm } from 'components/SettingsForm'
export { getServerSideProps } from 'lib/ssr/require-auth'

export default function Settings({ user }) {

  const props = user.settings
  return (
    <>
      <SettingsForm { ...props } />
    </>
  )
}
