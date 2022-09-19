import { useEffect, useState } from 'react'
import PopupWithForm from './PopupWithForm'
import Input from './Input'
import useFormAndValidation from '../hooks/useFormAndValidation'

export default function EditAvatarPopup(props) {
  const { isOpen, onClose, isSaving, onEditAvatar } = props

  const { values, handleChange, errors, isValid, resetForm } =
    useFormAndValidation()

  function handleEditAvatar(e) {
    e.preventDefault()
    onEditAvatar(values.avatarLink)
  }

  useEffect(() => {
    resetForm()
  }, [isOpen])

  return (
    <PopupWithForm
      name="edit-avatar"
      title="Обновить аватар"
      isOpen={isOpen}
      onClose={onClose}
      buttonText="Сохранить"
      isSaving={isSaving}
      onSubmit={handleEditAvatar}
      isValid={isValid}
    >
      <Input
        name="avatarLink"
        type="url"
        placeholder="Ссылка на картинку"
        value={values.avatarLink ? values.avatarLink : ''}
        onChange={handleChange}
        errorText={errors.avatarLink}
      />
    </PopupWithForm>
  )
}
