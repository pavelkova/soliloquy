import { Box, Close, MenuButton } from 'theme-ui'

export const Sidebar = (props) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Box onClick={ (e) => setIsOpen(!isOpen) }
      sx={{ zIndex: 5 }}>
        { isOpen ? <Close /> : <MenuButton /> }
      </Box>
      <Box sx={{ position: 'absolute',
                 display: isOpen ? 'initial' : 'none',
                 height: '100vh',
                 bg: 'muted',
                 zIndex: 1,
                 right: 0,
                 top: 0,
                 bottom: 0,
                 minWidth: '30vw',
                 p: 3 }}>
        { props.children }
      </Box>
    </>
  )
}
