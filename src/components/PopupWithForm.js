import closeIcon from '../images/close-icon.svg'
import { useEffect } from 'react'

export default function PopupWithForm(props) {
  const {
    name,
    title,
    children,
    isOpen,
    onClose,
    buttonText,
    onSubmit,
    isSaving,
    isValid,
  } = props

  function handleCloseByEsc(evt) {
    evt.key === 'Escape' && onClose()
  }

  return (
    <div
      className={`popup popup_type_${name} ${isOpen && 'popup_active'}`}
      onMouseDown={onClose}
    >
      <div
        className="popup__container"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h3 className="popup__title">{title}</h3>
        <form
          className={`popup__form popup__form_type_${name}`}
          noValidate
          name={name}
          onSubmit={onSubmit}
        >
          {children}
          <button
            type="submit"
            name="edit-profile-submit-button"
            className={`popup__submit-button
responsible-fade responsible-fade_opacity_strong ${
              (isSaving || !isValid) && 'popup__submit-button_inactive'
            }`}
          >
            {isSaving ? 'Сохранение...' : buttonText}
          </button>
        </form>
        <button
          type="button"
          aria-label="Отменить"
          className="popup__close-button  responsible-fade"
          onClick={onClose}
        >
          <img
            src={closeIcon}
            alt="Закрыть окно"
            className="popup__close-icon"
          />
        </button>
      </div>
    </div>
  )
}
