import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from './Header'
import PopupAlert from './PopupAlert'

export default function EntryForm(props) {
  const {
    linkTarget,
    linkText,
    buttonText,
    onSubmit,
    title,
    email,
    onEmailChange,
    password,
    onPasswordChange,
  } = props

  function handleSubmitRequest(e) {
    e.preventDefault()
    onSubmit()
  }

  const [isAlertPopupOpen, setIsAlertPopupOpen] = useState(false)
  return (
    <>
      <PopupAlert
        mode={title}
        isOpen={isAlertPopupOpen}
        onClose={() => setIsAlertPopupOpen(false)}
        success
      />
      <Header>
        <Link to={linkTarget} className="header__link responsible-fade">
          {linkText}
        </Link>
      </Header>
      <div className="entry-form">
        <h2 className="entry-form__title">{title}</h2>
        <form className="entry-form__form" onSubmit={handleSubmitRequest}>
          <input
            type="email"
            required
            placeholder="email"
            className="entry-form__input"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
          <input
            type="password"
            required
            placeholder="password"
            className="entry-form__input"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
          />
          <button className="entry-form__button responsible-fade">
            {buttonText}
          </button>
        </form>
        {title === 'Регистрация' && (
          <p className="entry-form__prompt">
            Уже зарегистрированы?{' '}
            <Link
              to={linkTarget}
              className="entry-form__prompt-link responsible-fade"
            >
              {linkText}
            </Link>
          </p>
        )}
      </div>
    </>
  )
}
