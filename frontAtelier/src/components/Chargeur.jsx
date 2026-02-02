// src/components/Chargeur.jsx
import './Chargeur.css';

const Chargeur = ({ size = 'medium', fullScreen = false }) => {
  const chargeur = (
    <div className={`loader loader-${size}`}>
      <div className="spinner"></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loader-fullscreen">
        {chargeur}
      </div>
    );
  }

  return chargeur;
};

export default Chargeur;