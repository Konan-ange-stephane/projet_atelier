import { Navigate } from 'react-router-dom';

/** Ancienne entrée « réservation » : le flux passe par trajets → détail → paiement. */
const Reservation = () => <Navigate to="/client/trajets" replace />;

export default Reservation;
