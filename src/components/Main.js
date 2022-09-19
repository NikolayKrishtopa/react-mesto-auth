import { useContext } from 'react'
import editIcon from '../images/pensil-icon.svg'
import addIcon from '../images/plus-icon.svg'
import Card from './Card.js'
import CurrentUserContext from '../contexts.js/CurrentUserContext'

export default function Main(props) {
  const {
    onEditProfile,
    onAddPlace,
    onEditAvatar,
    onCardClick,
    onRemoveClick,
    cards,
    onCardLike,
  } = props

  const currentUser = useContext(CurrentUserContext)

  return (
    <main className="content">
      <section className="navigation">
        <div className="profile">
          <button
            type="button"
            aria-label="Редактировать фото профиля"
            name="edit-avatar-button"
            onClick={onEditAvatar}
            className="profile__edit-avatar-button responsible-fade responsible-fade_opacity_strong"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="profile__avatar"
            />
          </button>
          <div className="profile__info">
            <div className="profile__container">
              <h1 className="profile__name">{currentUser.name}</h1>
              <button
                type="button"
                aria-label="Редактировать профиль"
                name="edit-profile-button"
                className="profile__edit-button responsible-fade"
                onClick={onEditProfile}
              >
                <img
                  src={editIcon}
                  alt="редактировать профиль."
                  className="profile__edit-icon"
                />
              </button>
            </div>
            <p className="profile__description">{currentUser.about}</p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Добавить ваше место"
          name="add-card-button"
          className="navigation__add-place-button responsible-fade"
          onClick={onAddPlace}
        >
          <img
            src={addIcon}
            alt="добавить ваше место."
            className="navigation__add-place-icon"
          />
        </button>
      </section>
      <section className="place-cards">
        {cards.map((card) => {
          return (
            <Card
              key={card._id}
              card={card}
              onCardClick={onCardClick}
              onRemoveClick={onRemoveClick}
              onCardLike={onCardLike}
            />
          )
        })}
      </section>
    </main>
  )
}
