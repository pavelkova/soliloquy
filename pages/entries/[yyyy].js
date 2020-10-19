import { useRouter } from 'next/router'
// check router if param is 4 digit number between 2000 and present year

export default function Year() {
  const router = useRouter()
  /* console.log('YEAR ->')
   * console.log(router.query) */
  return (
    <>
    'empty'
    </>
  )
}
export const getServerSideProps = async (ssr, ctx) => {
  console.log('SSR ->')
  /* console.log('SSR ->')
   * console.log(ssr) */
  return { props: { ...ctx } }
}
