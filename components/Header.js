import Link from 'next/link'
import { useState } from 'react'
import { palettes } from 'styles/themes'

const DropdownNav = ({ list }) => (
  <>
    <nav>
      <ul>
        { list.map(item => <li><Link href={ item.href }>{ item.text }</Link></li>) }
      </ul>
    </nav>
    <style jsx>{` {
   nav {
      position: absolute;
      background-color: #3d4852;
      top: 70px;
      left: 0;
      width: 100%;
    }
    nav ul {
      list-style-type: none;
    }
    nav ul li {
      padding: 0 15px;
    }
    a {
      display: inline-block;
      padding: 12px;
      color: #dae1e7;
      text-decoration: none;
      letter-spacing: 0.05em;
    }
    nav ul li a:hover,
    nav ul li a:focus {
      color: #eb6f4a;
    }
      }`}</style>
  </>
)

const Dropdown = ({ list }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div>
      <span onClick={() => setIsOpen(!isOpen) }>{ isOpen ? 'X' : '^'}</span>
      { isOpen && <DropdownNav list={ list } /> }
    </div>
  )
}

export const Header = () => {

  const linkList = [
    { href: '/today', text: 'Today' },
    { href: '/entries', text: 'All Entries' },
    { href: '/account/settings', text: 'Settings' },
    { href: '/logout', text: 'Logout' },
  ]

  return (
    <>
      <header>
        <h1>soliloquy</h1>
        <Dropdown list={ linkList } />
      </header>
      <style jsx>{` {
header {
height: 70px;
padding: 10px 0;
display: flex;
justify-content: space-between;
}
 h1 {
 font-family: Playfair Display;
 font-style: italic;
 font-size: 2rem;
 color: ${palettes.metals.brighter};
 }
      }`}</style>
    </>
  )
}
