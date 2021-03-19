import { Box, Button, Checkbox, Flex, Input, Label, Radio, Select } from 'theme-ui'

export const useSettingsFields = (register, currentSettings) => {

  function ClockDisplayFormat() {
    return (
      <Flex>
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

}
