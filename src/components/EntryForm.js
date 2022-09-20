import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from './Header'
import PopupAlert from './PopupAlert'

export default function EntryForm(props) {
  const { linkTarget, linkText, buttonText, onSubmit, title } = props

  const [isAlertPopupOpen, setIsAlertPopupOpen] = useState(false)
  return (
    <>
      {title === 'Регистрация' && (
        <PopupAlert
          isOpen={isAlertPopupOpen}
          onClose={() => setIsAlertPopupOpen(false)}
          success
        />
      )}
      <Header>
        <Link to={linkTarget} className="header__link responsible-fade">
          {linkText}
        </Link>
      </Header>
      <div className="entry-form">
        <h2 className="entry-form__title">{title}</h2>
        <form className="entry-form__form">
          <input
            type="email"
            required
            placeholder="email"
            className="entry-form__input"
          />
          <input
            type="password"
            required
            placeholder="password"
            className="entry-form__input"
          />
          <button className="entry-form__button">{buttonText}</button>
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
