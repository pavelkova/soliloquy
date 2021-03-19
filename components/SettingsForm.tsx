import { useForm } from 'react-hook-form'
import { useMutation } from 'urql'
import { Box, Button, Checkbox, Flex, Heading, Input, Label, Radio, Select } from 'theme-ui'
import { useFormFields } from './FormFields/Common'
import UPDATE_SETTINGS from 'mutations/UpdateSettings.graphql'

const SettingsGroup = props => {
  return (
    <Box sx={{ borderWidth: 1,
               borderStyle: 'solid',
               borderColor: 'muted',
               mb: 2,
               mt: 4,
               p: 2 }}>
      <Heading sx={{ border: 'inherit',
                     background: 'background',
                     width: 'max-content',
                     mt: '-24px',
                     p: 1 }}>{ props.title }</Heading>
      { props.children }
    </Box>
  )
}

export const SettingsForm = props => {
  const { register, handleSubmit, errors, formState } = useForm({
    defaultValues: props
  })
  const [EmailAddress, Password, Name, Timezone] = useFormFields(register)

  const [result, updateSettings] = useMutation(UPDATE_SETTINGS)

  const onSubmit = async values => {
    console.log(values)
    if (errors) console.error(errors)

    const { data, fetching, error } = await updateSettings({ settings: values })

    if (error) { console.error(error) }

    /* if (data?.login) redirectOnSuccess() */
    console.log(data)
    // setError
  }

  return (

    <Box as='form' onSubmit={ handleSubmit(onSubmit) }>
      <SettingsGroup title='Fonts'>
        <Label htmlFor='fontName' sx={{ mt: 2 }}>Font name</Label>
        <Input name='fontName' ref={register} />
        <Label htmlFor='fontSize' sx={{ mt: 2 }}>Font size</Label>
        <Input type='number' name='fontSize' ref={register} />
      </SettingsGroup>
      <SettingsGroup title='Account'>
        <EmailAddress />
        <Name/>
      </SettingsGroup>
      <SettingsGroup title='Update password'>
        <Password checkPattern={ false } name='oldPassword' title='Old password'  />
        <Password name='newPassword' title='New password' />
      </SettingsGroup>
      <Button type='submit' disabled={ !formState.isValid }>
        Submit
      </Button>
    </Box>
  )
}
