import closeIcon from '../images/close-icon.svg'
import burgerButton from '../images/burgerButton.svg'
import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Main from './Main'
import Footer from './Footer'
import Header from './Header'
import PopupWithForm from './PopupWithForm'
import ImagePopup from './ImagePopup'
import PopupLoading from './PopupLoading'
import api from '../utils/api'
import CurrentUserContext from '../contexts.js/CurrentUserContext'
import EditProfilePopup from './EditProfilePopup'
import AddPlacePopup from './AddPlacePopup'
import EditAvatarPopup from './EditAvatarPopup'
import EntryForm from './EntryForm'
import PopupAlert from './PopupAlert'
import {
  handleRegister,
  handleLogin,
  handleCheckAuth,
} from '../utils/authRequests'

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)
  const [alertPopupState, setAlertPopupState] = useState({})
  const [selectedCard, setSelectedCard] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState({})
  const [cards, setCards] = useState([])
  const [cardToRemove, setCardToRemove] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [isLogged, setIsLogged] = useState(false)
  const [isTopBarOpen, setIsTopBarOpen] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([api.getInititalCards(), api.getUserInfo()])
      .then(([cardsArr, userData]) => {
        setCards(cardsArr)
        setCurrentUser((old) => {
          return { ...old, ...userData }
        })
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/sign-in')
      return
    }
    setIsLoading(true)
    handleCheckAuth()
      .then((res) => {
        setIsLogged(true)
        setCurrentUser((old) => {
          return { ...old, email: res.data.email }
        })
        navigate('/')
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false))
  }, [localStorage.getItem('token')])

  function handleSubmitRegistration(email, password) {
    setAlertPopupState((old) => ({ ...old, mode: 'register' }))
    setIsLoading(true)
    handleRegister(password, email)
      .then((res) => {
        if (res.data) {
          setAlertPopupState((old) => ({ ...old, success: true }))
          navigate('./sign-in')
        } else setAlertPopupState((old) => ({ ...old, success: false }))
      })
      .catch((err) => {
        console.log(err)
        setAlertPopupState((old) => ({ ...old, success: false }))
      })
      .finally(() => {
        setIsLoading(false)
        setAlertPopupState((old) => ({ ...old, isOpen: true }))
      })
  }

  function handleSubmitLogin(email, password) {
    setAlertPopupState((old) => ({ ...old, mode: 'login' }))
    setIsLoading(true)
    handleLogin(password, email)
      .then((res) => {
        if (!!res.token) {
          localStorage.setItem('token', res.token)
          navigate('./')
          setAlertPopupState((old) => ({ ...old, success: true }))
        } else setAlertPopupState((old) => ({ ...old, success: false }))
      })
      .catch((err) => {
        console.log(err)
        setAlertPopupState((old) => ({ ...old, success: false }))
      })
      .finally(() => {
        setIsLoading(false)
        setAlertPopupState((old) => ({ ...old, isOpen: true }))
      })
  }

  function handleLogout() {
    if (!localStorage.getItem('token')) return
    localStorage.removeItem('token')
    setIsLogged(false)
    navigate('/sign-in')
  }

  function handleCardLike(card, isLiked) {
    api
      .handleLikeServer(card, isLiked)
      .then((newCard) =>
        setCards(cards.map((e) => (newCard._id === e._id ? newCard : e)))
      )
      .catch((err) => console.log(err))
  }

  function handleCardDelete(e) {
    setIsSaving(true)
    e.preventDefault()
    api
      .removeCard(cardToRemove)
      .then(() => {
        setCards((oldCardsArr) =>
          oldCardsArr.filter((cardItem) => cardItem._id !== cardToRemove._id)
        )
        closeAllPopups()
      })
      .catch((err) => console.log(err))
      .finally(() => setIsSaving(false))
  }

  const isAnyPopupOpen =
    alertPopupState.isOpen ||
    isEditAvatarPopupOpen ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    selectedCard.link ||
    cardToRemove.link

  useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === 'Escape') {
        closeAllPopups()
      }
    }
    if (isAnyPopupOpen) {
      document.addEventListener('keydown', closeByEscape)
      return () => {
        document.removeEventListener('keydown', closeByEscape)
      }
    }
  }, [isAnyPopupOpen])

  function handleCardClick(card) {
    setSelectedCard(card)
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false)
    setIsEditProfilePopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setSelectedCard({})
    setCardToRemove({})
    setAlertPopupState({ ...alertPopupState, isOpen: false })
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
  }

  function handleRemoveClick(card) {
    setCardToRemove(card)
  }

  function handleUpdateUser(user) {
    setIsSaving(true)
    api
      .setUserInfo(user)
      .then((res) => {
        setCurrentUser(res)
        closeAllPopups()
      })
      .catch((err) => console.log(err))
      .finally(() => setIsSaving(false))
  }

  function handleAddCard(card) {
    setIsSaving(true)
    api
      .createNewCard(card)
      .then((res) => {
        setCards([res, ...cards])
        closeAllPopups()
      })
      .catch((err) => console.log(err))
      .finally(() => setIsSaving(false))
  }

  function handleUpdateAvatar(url) {
    setIsSaving(true)
    api
      .setAvatar(url)
      .then((res) => {
        setCurrentUser(res)
        closeAllPopups()
      })
      .catch((err) => console.log(err))
      .finally(() => setIsSaving(false))
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">
        {isLoading && <PopupLoading />}
        <div className={`page ${isLoading && 'page_loading'}`}>
          <div className={`top-bar ${isTopBarOpen && 'top-bar_active'}`}>
            <span className="header__link">{currentUser.email}</span>
            <a
              href="#"
              className="header__link header__link_style_fade responsible-fade"
              onClick={handleLogout}
            >
              Выйти
            </a>
          </div>
          <PopupAlert
            mode={alertPopupState.mode}
            isOpen={alertPopupState.isOpen}
            onClose={() => closeAllPopups()}
            success={alertPopupState.success}
          />
          <Routes>
            <Route
              path="/sign-up"
              element={
                <EntryForm
                  linkTarget="/sign-in"
                  linkText="Войти"
                  buttonText="Зарегистрироваться"
                  onSubmit={handleSubmitRegistration}
                  title="Регистрация"
                  navigate={navigate}
                />
              }
            />
            <Route
              path="/sign-in"
              element={
                <EntryForm
                  linkTarget="/sign-up"
                  linkText="Регистрация"
                  buttonText="Войти"
                  onSubmit={handleSubmitLogin}
                  title="Вход"
                  navigate={navigate}
                />
              }
            />
            <Route
              path="/"
              element={
                isLogged ? (
                  <>
                    <Header>
                      <div className="header__user-info">
                        <span className="header__link">
                          {currentUser.email}
                        </span>
                        <a
                          href="#"
                          className="header__link header__link_style_fade responsible-fade"
                          onClick={handleLogout}
                        >
                          Выйти
                        </a>
                      </div>
                      <button
                        className="header__button responsible-fade"
                        onClick={() => setIsTopBarOpen(!isTopBarOpen)}
                      >
                        <img
                          className={`header__button-picture ${
                            isTopBarOpen && 'header__button-picture_small'
                          }`}
                          src={isTopBarOpen ? closeIcon : burgerButton}
                        />
                      </button>
                    </Header>
                    <Main
                      onEditProfile={handleEditProfileClick}
                      onAddPlace={handleAddPlaceClick}
                      onEditAvatar={handleEditAvatarClick}
                      onCardClick={handleCardClick}
                      onRemoveClick={handleRemoveClick}
                      cards={cards}
                      onCardLike={handleCardLike}
                    />
                    <Footer />
                  </>
                ) : (
                  <Navigate to="/sign-in" />
                )
              }
            />
          </Routes>
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            isSaving={isSaving}
            onEditAvatar={handleUpdateAvatar}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            isSaving={isSaving}
            onEditAvatar={handleUpdateAvatar}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddCard={handleAddCard}
            isSaving={isSaving}
          />
          <PopupWithForm
            name="confirm"
            title="Вы уверены?"
            isOpen={cardToRemove.link}
            onClose={closeAllPopups}
            onSubmit={handleCardDelete}
            buttonText="Да"
            isSaving={isSaving}
            isValid={true}
          />
          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        </div>
      </div>
    </CurrentUserContext.Provider>
  )
}

export default App
