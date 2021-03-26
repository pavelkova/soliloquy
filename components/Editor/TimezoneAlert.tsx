import NextLink from 'next/link'
import { Alert, Box, Button, Form, Link, Switch } from 'theme-ui'

const currentTime = tz => {
  new Date().toLocaleTimeString('en-US', {
    // hour12: user.settings
    timeZone: tz, hour: '2-digit', minute: '2-digit' })
}

export const TimezoneAlert = user => {
  // useAuth to get user instead of prop
  const setting = user.settings.timezone
  const browser = Intl.DateTimeFormat().resolvedOptions().timeZone
  const isHidden = Boolean((setting == 'AUTO' ||
                            /* !user.askOnTimezoneMismatch|| */
                            setting == browser))

  return (
    <Alert sx={{ display: isHidden ? 'none' : 'absolute' }}>
      <p>Your settings are configured to use the timezone { setting }
      (<b>{ currentTime(setting) }</b>), but your browser is set for { browser }
    (<b>{ currentTime(browser) }</b>).</p>
    {/* <Heading>current time of selected choice<Heading/> */}
    <Box as={Form}>
      <Button>Keep using my setting</Button>
      <Button>Use my browser's timezone</Button>
      <Switch label="Remember my choice" defaultChecked={ true } />
      <Switch label="Don't show this warning again" defaultChecked={ false } />
    </Box>
    <p>Your timezone preferences can also be managed in <NextLink href='/account/settings' passHref><Link>account settings</Link></NextLink>.</p>
    </Alert>
  )
}

const isValid = {
  timezone: (tz: string) => {
    try {
      return new Date().toLocaleString('en-US', {
        timeZone: tz })
    } catch (e) { return false }
  }
}
