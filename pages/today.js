export default function Today() {

    const date = () => {
        const t = new Date()
        return t.getFullYear() + '-'
             + ('0' + (t.getMonth()+1)).slice(-2) + '-'
             + ('0' + t.getDate()).slice(-2)
    }

  return (
      <div>
      <h1>{ date() }</h1>
      <textarea width="100vw"></textarea>
      </div>
  )
}
