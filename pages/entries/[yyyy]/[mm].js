import { useRouter } from 'next/router'
// check router that param is a single digit greater than 1, add a leading 0,

/*
   2020 10 10
   2020  4 15
   2020 10  5
   2020  4  5
     20 10 10
     20  4 15

*/

export default function Month() {
  const router = useRouter()
  const { yyyy, mm } = router.query

  console.log('MONTH ->')
  console.log(router.query)
  return (
    <>
    'empty'
    </>
  )
}
