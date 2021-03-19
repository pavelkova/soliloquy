import React, { useState } from 'react'
import { Box, Button, Checkbox, Flex, Input, Label, Radio, Select } from 'theme-ui'

const isRequired = { required: true }

const ClockDisplayFormat = register => {
  return (
    <Flex>
      <Text>Clock display format</Text>
      <Label>
        <Radio name='timeFormat' value='12hr' ref={register} />
        12-hour
      </Label>
      <Label>
        <Radio name='timeFormat' value='24hr' ref={register} />
        24-hour
      </Label>
    </Flex>
  )
}

const DayStartsAt = register => {
  return <Input type='time' name='dayStartsAt' ref={register} />
}

const WordCountGoal = register => {
  return <Input type='number' name='wordCountGoal' ref={register} />
}

const FontName = register => {
  return <Input name='fontName' ref={register} />
}

const FontSize = register => {
  return <Input type='number' name='fontSize' ref={register} />
}

const TextAnalysis = register => {
  return (
    <Label>
      <Checkbox name='textAnalysis' ref={register} />
      Text Analysis
    </Label>
  )
}

const Color = (register, name) => {
  return (
    <Input type='color' name={name} ref={register} />
  )
}

const SelectGroup = (register, name, label, options = []) {
  return (
    <>
      <Select name={name} ref={register}>
        {options.map(option => (
          <option value={option.name}>{ option.label }</option>
        ))}
      </Select>
    </>
  )
}

// currentValues: SettingsType (user.settings)
const useFormFields = (register, watch, checkPattern = true) => {
  const EmailAddress = () => {
    const registerProps = checkPattern
                        ? { ...isRequired, pattern: /^\S+@\S+$/i }
                        : isRequired
    return <Input type='email' name='email' ref={register(registerProps)} />
  }

  const Password = () => {
    const [passwordVisible, setPasswordVisible] = useState(false)
    const registerProps = checkPattern
                        ? { ...isRequired }
                        : isRequired
    return (
      <>
        <Label htmlFor='password'>Password</Label>
        <Flex>
          <Input type={ passwordVisible ? 'text' : 'password' }
                 name='password'
                 ref={register(registerProps)} />
        </Flex>
      </>
    )
  }

  const Name = () => {
  const registerProps = { ...isRequired, maxLength: {
    value: 80,
    message: 'Name cannot be more than 80 characters long.' }}

  return (
    <>
      <Label htmlFor='name'></Label>
      <Input type='text' name='name' ref={register(registerProps)} />
    </>
  )
}

const Timezone = () => {
  return (
    <Select name='timezone'></Select>
  )
}

  const AppearanceFields = props => {
    const watchTheme = watch('theme', props.theme)
    const watchFontName = watch('fontName', props.fontName)
    const watchFontSize = watch('fontSize', props.fontSize)
    const watchFgColor = watch('fgColor', props.foregroundColor)
    const watchBgColor = watch('bgColor', props.backgroundColor)
    const watchHlColor = watch('hlColor', props.highlightColor)

    return (
      <Box>
        <Box>
          Fonts
          <Flex>
            <Label htmlFor='fontName'>Font Name</Label>
            <Input name='fontName' />
            <Label htmlFor='fontSize'>Font Size</Label>
            <Input type='number' name='fontSize' />
          </Flex>
        </Box>
        <Box>
          Theme
          <Label htmlFor='theme'></Label>
          <Select name='theme'></Select>
          <Flex>
            <Label htmlFor='foreground'>Foreground</Label>
            <Input type='color' name='foreground' value={ fgColor } />
            <Label htmlFor=''>Background</Label>
            <Input type='color' name='background' value={ bgColor } />
            <Label htmlFor=''>Highlight</Label>
            <Input type='color' name='highlight' value={ hlColor } />
          </Flex>
        </Box>
        <Box>
          Preview
        </Box>
      </Box>
    )
  }
  return [EmailAddress,
          Password,
          Name,
          Timezone,
          WordCountGoal,
          DayStartsAt,
  ]
}
