import React, { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { Grid } from '@mui/material';

// Objet Carte
interface Carte {
    // Pour le map
    id : number,
    // Pour la photo
    src : string,
    // Pour savoir si deux photos se correspondent
    cle : number,
    // Pour savoir si on doit afficher ou non l'image au joueur
    afficher : boolean
}

// Paramètre de Cartes
interface ICarteProps {
    nombreEssais : number,
    setNombreEssais : React.Dispatch<React.SetStateAction<number>>,
    partieEnCours : boolean,
    setPartieEnCours : React.Dispatch<React.SetStateAction<boolean>>
}

// Fonction pour mélanger les cartes
/** Code emprunté : https://www.freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/ */
function MelangerCartes(tableau : Carte[]) : Carte[] {
    const copieTableau = [...tableau];
    for (let i = copieTableau.length - 1; i > 0; i--) { 
        const j = Math.floor(Math.random() * (i + 1)); 
        [copieTableau[i], copieTableau[j]] = [copieTableau[j], copieTableau[i]]; 
    }
    return copieTableau; 
}

// Composant Cartes
const Cartes : React.FC<ICarteProps> = ({
    nombreEssais,
    setNombreEssais,
    partieEnCours,
    setPartieEnCours
}) => {
    let monChrono : number;
    // Référence au dessus de carte
    const dessusCarte = "./dessus-carte.svg"
    // Éviter de pouvoir cliquer pendant que le timer roule
    let timerActif = false
    // Les bonnes combinaisons de clés
    const [bonnesCombinaisons, setBonnesCombinaisons] = useState<Carte[]>([])
    // La combinaison à vérifier
    const [combinaison, setCombinaison] = useState<Carte[]>([])
    // Les cartes
    const [cartes, setCartes] = useState<Carte[]>([
        {id : 1, src : "./chat1.png", cle : 1, afficher : false},
        {id : 2, src : "./chat1.png", cle : 1, afficher : false},
        {id : 3, src : "./chat2.png", cle : 2, afficher : false},
        {id : 4, src : "./chat2.png", cle : 2, afficher : false},
        {id : 5, src : "./chat3.png", cle : 3, afficher : false},
        {id : 6, src : "./chat3.png", cle : 3, afficher : false},
        {id : 7, src : "./chat4.png", cle : 4, afficher : false},
        {id : 8, src : "./chat4.png", cle : 4, afficher : false},
        {id : 9, src : "./chat5.png", cle : 5, afficher : false},
        {id : 10, src : "./chat5.png", cle : 5, afficher : false},
        {id : 11, src : "./chat6.png", cle : 6, afficher : false},
        {id : 12, src : "./chat6.png", cle : 6, afficher : false},
        {id : 13, src : "./chat7.png", cle : 7, afficher : false},
        {id : 14, src : "./chat7.png", cle : 7, afficher : false},
        {id : 15, src : "./chat8.png", cle : 8, afficher : false},
        {id : 16, src : "./chat8.png", cle : 8, afficher : false},
    ]) 

    // Mélanger les cartes au démarrage de l'application
    useEffect(() => {
        setCartes(MelangerCartes(cartes))
    }, []);

    // Si plus aucune carte, terminer la partie
    useEffect(() => {
        if(bonnesCombinaisons.length == cartes.length){
            setPartieEnCours(false)
        }
    }, [bonnesCombinaisons])

    // Vérifier si les cartes ont été mélangé au démarrage
    useEffect(() => {
        if(cartes[0].id != 1 && cartes[cartes.length - 1].id != cartes.length){
            console.log("mélangé");
        }
    }, [cartes]);

    // Réagir lors du changement du tableau combinaison
    useEffect(() => {
        if(combinaison.length == 2){
            setNombreEssais(nombreEssais - 1)
            if(combinaison[0].cle == combinaison[1].cle){
                let copieTableau = [...bonnesCombinaisons]
                copieTableau = copieTableau.concat(combinaison[0], combinaison[1])
                setBonnesCombinaisons(copieTableau)
                setCombinaison([])
            } else {
                // Délai de 1 seconde
                timerActif = true
                /** Emprunté de : https://www.freecodecamp.org/news/how-to-use-settimeout-in-react-using-hooks/ */
                monChrono = setTimeout(() => {
                    console.log("n'affiche plus");
                    for(let i = 0; i < combinaison.length; i++){
                        combinaison[i].afficher = false;
                    }
                    setCombinaison([])
                    timerActif = false
                }, 1000);
            }
        }
    }, [combinaison])

    // Retourner les cartes restantes à la fin de la partie
    useEffect(() => {
        if(!partieEnCours){
            retournerCartes()
        }
    }, [partieEnCours])

    // Lors d'un clic, réagir
    function reagirClic(carte : Carte){
       if(partieEnCours){
        // Si on clique à nouveau sur une carte bonne ou une carte déjà saisie
        if(bonnesCombinaisons.includes(carte) || combinaison.includes(carte) || timerActif){
            return
        }
        // Si la deuxième combinaison n'a pas été saisie
        if(combinaison.length <  2){
            console.log("Clé : " + carte.cle)
            let copieTableau = [...combinaison]
            copieTableau = copieTableau.concat(carte)
            carte.afficher = true
            setCombinaison(copieTableau)
        }
       }
    }

    //Retourner les cartes
    function retournerCartes(){
        clearTimeout(monChrono)
        setTimeout(() => {
            for(let i = 0; i < cartes.length; i++){
                cartes[i].afficher = true
                console.log(cartes[i].afficher)
            }
        }, 1000)
    }


    // Affichage des cartes
    return (        
        <div>
            <Grid container spacing={2} justifyContent={"CENTER"}>
                {
                // Documentation map : https://legacy.reactjs.org/docs/lists-and-keys.html
                cartes.map((carte) =>
                    <Grid item xs={3}>
                        { // Code emprunté de Card : https://web3.profinfo.ca/react_styles/#utiliser-material-ui}
                        <Card onClick={() => reagirClic(carte)}sx={{ width: 250, height: 250 }}>
                                {
                                // Documentation condition pour afficher : https://apical.xyz/fiches/rendu_conditionnel/afficher_une_chose_ou_une_autre_selon_une_condition
                                carte.afficher ?
                                    (<CardMedia
                                    image={carte.src}
                                    sx={{ height: 250, width: 250}}
                                    />) :
                                    (<CardMedia
                                    image={dessusCarte}
                                    sx={{ height: 250, width: 250}}
                                    />)
                                }
                        </Card>}
                    </Grid>
                )}
            </Grid>
        </div>
    );
}

export default Cartes;
