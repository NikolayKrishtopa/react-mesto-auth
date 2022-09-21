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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isTopBarOpen, setIsTopBarOpen] = useState(false)

  const BASE_URL = 'https://auth.nomoreparties.co'

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
    fetch(`${BASE_URL}/users/me`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      method: 'GET',
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
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

  function handleSubmitRegistration() {
    setAlertPopupState((old) => ({ ...old, mode: 'register' }))
    setIsLoading(true)
    return fetch(`${BASE_URL}/signup`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ password, email }),
    })
      .then((res) => res.ok && res.json())
      .then((res) => {
        if (!!res.data) {
          setAlertPopupState((old) => ({ ...old, success: true }))
          navigate('./sign-in')
        } else setAlertPopupState((old) => ({ ...old, success: false }))
      })
      .catch((err) => {
        console.log(err)
        setAlertPopupState((old) => ({ ...old, success: true }))
      })
      .finally(() => {
        setIsLoading(false)
        setAlertPopupState((old) => ({ ...old, isOpen: true }))
        clearForm()
      })
  }

  function clearForm() {
    setEmail((old) => '')
    setPassword((old) => '')
    setIsTopBarOpen(false)
  }

  function handleSubmitLogin() {
    setAlertPopupState((old) => ({ ...old, mode: 'login' }))
    setIsLoading(true)
    return fetch(`${BASE_URL}/signin`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ password, email }),
    })
      .then((res) => res.ok && res.json())
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
        clearForm()
      })
  }

  function handleLogout() {
    if (!localStorage.getItem('token')) return
    localStorage.removeItem('token')
    setIsLogged(false)
    navigate('/sign-in')
    clearForm()
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
                  email={email}
                  password={password}
                  onEmailChange={setEmail}
                  onPasswordChange={setPassword}
                  linkTarget="/sign-in"
                  linkText="Войти"
                  buttonText="Зарегистрироваться"
                  onSubmit={handleSubmitRegistration}
                  title="Регистрация"
                />
              }
            />
            <Route
              path="/sign-in"
              element={
                <EntryForm
                  email={email}
                  password={password}
                  onEmailChange={setEmail}
                  onPasswordChange={setPassword}
                  linkTarget="/sign-up"
                  linkText="Регистрация"
                  buttonText="Войти"
                  onSubmit={handleSubmitLogin}
                  title="Вход"
                />
              }
            />
            <Route
              path="/"
              element={
                isLogged ? (
                  <>
                    <div
                      className={`top-bar ${isTopBarOpen && 'top-bar_active'}`}
                    >
                      <span className="header__link">{currentUser.email}</span>
                      <a
                        href="#"
                        className="header__link header__link_style_fade responsible-fade"
                        onClick={handleLogout}
                      >
                        Выйти
                      </a>
                    </div>
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
                    <Footer />
                  </>
                ) : (
                  <Navigate to="/sign-in" />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </CurrentUserContext.Provider>
  )
}

export default App
