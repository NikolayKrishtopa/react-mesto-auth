import { useState, useContext, useEffect } from 'react'
import PopupWithForm from './PopupWithForm'
import CurrentUserContext from '../contexts.js/CurrentUserContext'
import Input from './Input'
import useFormAndValidation from '../hooks/useFormAndValidation'

export default function EditProfilePopup(props) {
  const { isOpen, onClose, onUpdateUser, isSaving } = props

  const currentUser = useContext(CurrentUserContext)

  const { values, handleChange, errors, isValid, resetForm } =
    useFormAndValidation()

  useEffect(() => {
    resetForm({ userName: currentUser.name, userAbout: currentUser.about })
  }, [isOpen])

  function handleSubmit(e) {
    e.preventDefault()
    onUpdateUser({ name: values.userName, about: values.userAbout })
  }

  return (
    <PopupWithForm
      name="edit-profile"
      title="Редактировать профиль"
      isOpen={isOpen}
      onClose={() => {
        onClose()
      }}
      buttonText="Сохранить"
      onSubmit={handleSubmit}
      isSaving={isSaving}
      isValid={isValid}
    >
      <Input
        type="text"
        name="userName"
        placeholder="Имя пользователя"
        value={values.userName ? values.userName : ''}
        onChange={handleChange}
        errorText={errors.userName}
      />
      <Input
        type="text"
        name="userAbout"
        placeholder="Расскажите о себе"
        value={values.userAbout ? values.userAbout : ''}
        onChange={handleChange}
        errorText={errors.userAbout}
      />
    </PopupWithForm>
  )
}
