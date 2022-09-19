import Input from './Input'
import PopupWithForm from './PopupWithForm'
import { useEffect } from 'react'
import useFormAndValidation from '../hooks/useFormAndValidation'

export default function AddPlacePopup(props) {
  const { isOpen, onClose, onAddCard, isSaving } = props
  const { values, handleChange, errors, isValid, resetForm } =
    useFormAndValidation()

  useEffect(() => {
    resetForm()
  }, [isOpen])

  function handleSubmit(e) {
    e.preventDefault()
    onAddCard({ name: values.cardName, link: values.cardLink })
  }

  return (
    <PopupWithForm
      name="add-card"
      title="Новое место"
      isOpen={isOpen}
      onClose={onClose}
      buttonText="Создать"
      onSubmit={handleSubmit}
      isSaving={isSaving}
      isValid={isValid}
    >
      <Input
        name="cardName"
        type="text"
        maxLength={40}
        placeholder="Название"
        value={values.cardName ? values.cardName : ''}
        onChange={handleChange}
        errorText={errors.cardName}
      />
      <Input
        name="cardLink"
        type="url"
        placeholder="Ссылка на картинку"
        value={values.cardLink ? values.cardLink : ''}
        onChange={handleChange}
        errorText={errors.cardLink}
      />
    </PopupWithForm>
  )
}
