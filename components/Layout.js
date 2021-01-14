import { Header } from './Header'

export const Layout = () => (
  <div className='wrapper'>
    <Header />
    <style jsx>{`
.wrapper {
height: 100vh;
width:100vw;
margin: 0;
padding: 0;
}
      `}</style>
  </div>
)
