import { Children } from 'react'
import logo from '../images/logo.svg'

export default function Header(props) {
  const { children } = props
  return (
    <header className="header">
      <img
        src={logo}
        alt="Логотип приложениея Место."
        className="header__logo"
      />
      {children}
    </header>
  )
}
