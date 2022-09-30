import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import useFormAndValidation from '../hooks/useFormAndValidation'

export default function EntryForm(props) {
  const { linkText, linkTarget, buttonText, onSubmit, title, navigate } = props

  const { values, handleChange, errors, isValid, resetForm } =
    useFormAndValidation()

  function handleSubmitRequest(e) {
    e.preventDefault()
    onSubmit(values.email, values.password)
  }

  useEffect(() => {
    resetForm()
  }, [navigate])

  return (
    <div className="entry-form">
      <h2 className="entry-form__title">{title}</h2>
      <form
        className="entry-form__form"
        onSubmit={handleSubmitRequest}
        noValidate
      >
        <input
          type="email"
          name="email"
          required
          minLength={2}
          maxLength={20}
          placeholder="email"
          className="entry-form__input"
          value={values.email ? values.email : ''}
          onChange={handleChange}
        />
        <p className="entry-form__input-error">{errors.email}</p>
        <input
          type="password"
          name="password"
          minLength={2}
          maxLength={20}
          required
          placeholder="password"
          className="entry-form__input"
          value={values.password ? values.password : ''}
          onChange={handleChange}
        />
        <p className="entry-form__input-error">{errors.password}</p>
        <button
          className="entry-form__button responsible-fade"
          disabled={!isValid}
        >
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
  )
}
