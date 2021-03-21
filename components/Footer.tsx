import { Box, Flex } from 'theme-ui'

export const Footer = props => {
  return (
    <Flex sx={{ flexWrap: 'wrap' }}>
    </Flex>
  )
}

/* export default props =>
 *   <div
 *   sx={{
 *     display: 'flex',
 *     flexWrap: 'wrap',
 *   }}>
 *   <aside
 *     sx={{
 *       flexGrow: 1,
 *       flexBasis: 'sidebar',
 *     }}>
 *     Sidebar
 *   </aside>
 *   <main
 *     sx={{
 *       flexGrow: 99999,
 *       flexBasis: 0,
 *       minWidth: 320,
 *     }}>
 * Main
 * </main>
 * </div> */

/* <div
 *   sx={{
 *     display: 'flex',
 *     flexWrap: 'wrap',
 *   }}>
 *   <aside
 *     sx={{
 *       flexGrow: 1,
 *       flexBasis: 'sidebar',
 *     }}>
 *     Sidebar
 *   </aside>
 *   <main
 *     sx={{
 *       flexGrow: 99999,
 *       flexBasis: 0,
 *       minWidth: 320,
 *     }}>
 *     {props.children}
   </main>
   </div> */
