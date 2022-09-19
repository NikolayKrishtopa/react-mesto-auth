import closeIcon from '../images/close-icon.svg'
import { useEffect } from 'react'

export default function ImagePopup(props) {
  const { card, onClose } = props

  return (
    <div
      className={`popup popup_type_picture-full-screen ${
        Object.keys(card).length !== 0 && 'popup_active'
      }`}
      onClick={onClose}
    >
      <div
        className="popup__photo-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="закрыть окно."
          className="popup__close-button  responsible-fade"
          onClick={onClose}
        >
          <img
            src={closeIcon}
            alt="Закрыть окно."
            className="popup__close-icon"
          />
        </button>
        <img src={card.link} alt={card.name} className="popup__photo" />
        <h3 className="popup__title popup__title_type_photo">{card.name}</h3>
      </div>
    </div>
  )
}
