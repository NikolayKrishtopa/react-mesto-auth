import closeIcon from '../images/close-icon.svg'
import successImg from '../images/success.png'
import failureImg from '../images/failure.png'

export default function PopupAlert(props) {
  const { isOpen, onClose, success, mode } = props

  return (
    <div className={`popup ${isOpen && 'popup_active'}`} onMouseDown={onClose}>
      <div
        className="popup__container"
        onMouseDown={(e) => e.stopPropagation()}
      >
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
        <div className="popup__alert-container">
          <img
            src={success ? successImg : failureImg}
            className="popup__alert-img"
          />
          <p className="popup__alert-text">
            {success
              ? `Вы успешно ${
                  mode === 'Регистрация' ? 'зарегистрировались' : 'вошли'
                }!`
              : 'Что-то пошло не так! Попробуйте ещё раз.'}
          </p>
        </div>
      </div>
    </div>
  )
}
