import { useState } from "react";

function AjouterTrajet() {

  const [depart, setDepart] = useState("");
  const [arrivee, setArrivee] = useState("");
  const [prix, setPrix] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      depart,
      arrivee,
      prix
    });
  };

  return (
    <div>
      <h2>Ajouter un trajet</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ville de départ"
          value={depart}
          onChange={(e) => setDepart(e.target.value)}
        />

        <input
          type="text"
          placeholder="Ville d'arrivée"
          value={arrivee}
          onChange={(e) => setArrivee(e.target.value)}
        />

        <input
          type="number"
          placeholder="Prix"
          value={prix}
          onChange={(e) => setPrix(e.target.value)}
        />

        <button type="submit">Ajouter trajet</button>
      </form>
    </div>
  );
}

export default AjouterTrajet;