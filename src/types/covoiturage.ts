
export type Covoiturage = {
  covoiturage_id: number;
  date_depart: string;
  heure_depart: string;
  lieu_depart: string;
  date_arrivee: string;
  heure_arrivee: string;
  lieu_arrivee: string;
  statut: string;
  nb_place: number;
  prix_personne: number;
};

export type Voiture = {
  voiture_id: number;
  modele: string | null;
  immatriculation: string | null;
  energie: string | null;
  couleur: string | null;
  date_premiere_immatriculation: string | null;
  marque_id: number | null;
};

export type Marque = {
  marque_id: number;
  libelle: string | null;
};
