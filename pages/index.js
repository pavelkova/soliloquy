export default function Index() {

    const today = () => {
        const t = new Date()
        return t.getFullYear()
             + ('0' + (t.getMonth()+1)).slice(-2)
             + ('0' + t.getDate()).slice(-2)
    }

  return (
      <div>
      <h1>{ today() }</h1>
      <textarea width="100vw"></textarea>
    </div>
  )
}
