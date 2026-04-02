export default function ListePassagers() {

  const passagers = [
    { id:1, nom:"Kouassi Jean" },
    { id:2, nom:"Traore Aminata" }
  ];

  return (
    <div>

      <h1 className="text-2xl mb-4">
        Passagers du trajet
      </h1>

      <ul className="bg-white p-6 rounded shadow">
        {passagers.map(p => (
          <li key={p.id}>{p.nom}</li>
        ))}
      </ul>

    </div>
  );
}