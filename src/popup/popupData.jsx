
import "./popup.css"; 

const PopupData = ({ title, content, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>{title}</h2>
        <div className="popup-content">{content}</div>
        <button onClick={onClose} className="popup-close-btn">
          Close
        </button>
      </div>
    </div>
  );
};

export default PopupData;
