import { useState } from 'react'

const preferences = {
  timezone: '',
  theme: '',
  fontName: '',
  fontSize: 14,
  wordCountGoal: 750,
  backgroundColor: '#000000',
  textColor: '#ffffff',
  highlightColor: '',
  textAnalysis: false
}

function Input({ name, initialValue, setFunction }) {
  return (
    <div>
      <label>
        <input
          id={ name }
          name={ name }
          value={ initialValue }
          onChange={(e) => setFunction(e.currentTarget.value) } />
      </label>
    </div>
  )
}

export const SettingsForm = (props) => {
  const [timezone, setTimezone] = useState(props.timezone)
  const [wordCountGoal, setWordCountGoal] = useState(props.wordCountGoal)
  const [textAnalysis] = useState(props.textAnalysis)
  const [theme, setTheme] = useState(props.theme)
  const [backgroundColor, setBackgroundColor] = useState(props.backgroundColor)
  const [textColor, setTextColor] = useState(props.textColor)
  const [highlightColor, setHighlightColor] = useState(props.highlightColor)
  const [fontName, setFontName] = useState(props.fontName)
  const [fontSize, setFontSize] = useState(props.fontSize)

  return (
    <>
      <form>
        <Input name='word-count-goal' initialValue={ wordCountGoal } setFunction={ setWordCountGoal } />
    <Input />
      </form>
    </>
  )
}
