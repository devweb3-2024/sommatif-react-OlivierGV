import { useState, useEffect } from 'react';
import './App.css';
import Cartes from './components/cartes.component'

function App() {
  // 20 coups max
  const [nombreCoups, setNombreCoups] = useState(1);
  // Si la partie est en cours ou non
  const [partieEnCours, setPartieEnCours] = useState(true);

  // Si le nombre de coups augmente, on vérifie l'état de la partie
  useEffect(() => {
    if(nombreCoups <= 0){
      setPartieEnCours(false)
    }
  }, [nombreCoups])

  // Rafraîchir la page
  /** Emprunté de : https://upmostly.com/tutorials/how-to-refresh-a-page-or-component-in-react */
  function RelancerPartie() {
    window.location.reload();
  }

  // Je suis vraiment incertain de savoir comment on fait des if imbriqués ou des else if(...) en React, donc je m'excuse pour ces conditions
  return (
    <div className='jeu'>
      <h1>Jeu de mémoire</h1>
      <p>Nombre de coups : {nombreCoups}</p>
      {
        !partieEnCours && nombreCoups == 0 ?
        (<p>Partie perdue!</p>) : (<></>)
      }
      {
        !partieEnCours && nombreCoups > 0 ?
        (<p>Partie gagnée!</p>) : (<></>)
      }
      {
        !partieEnCours ?
        <>
        <button onClick={RelancerPartie}>Relancer la partie!</button>
        </>
        : <></>
      }
      <br></br>
      <Cartes
        nombreEssais={nombreCoups}
        setNombreEssais={setNombreCoups}
        partieEnCours={partieEnCours}
        setPartieEnCours={setPartieEnCours}/>
    </div>
  );
}

export default App;
