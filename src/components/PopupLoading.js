import spinner from '../images/spinner.gif'

export default function PopupLoading() {
  return (
    <div className="popup popup_active popup_type_page-loading">
      <img src={spinner} alt="Идет загрузка" className="popup__spinner" />
    </div>
  )
}
