export default function Input(props) {
  const { type, name, placeholder, value, onChange, maxLength, errorText } =
    props
  return (
    <>
      <input
        type={type}
        className={`popup__field ${errorText && 'popup__field_state_error'}`}
        name={name}
        placeholder={placeholder}
        required
        minLength="2"
        maxLength={maxLength}
        value={value}
        onChange={onChange}
      />
      <p
        className={`popup__input-error ${
          errorText && 'popup__input-error_active'
        }`}
      >
        {errorText}
      </p>
    </>
  )
}
