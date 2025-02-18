
export type Utilisateur = {
  utilisateur_id: number;
  nom: string | null;
  prenom: string | null;
  email: string | null;
  password: string | null;
  telephone: string | null;
  adresse: string | null;
  date_naissance: string | null;
  photo: Uint8Array | null;
  pseudo: string | null;
};

export type Role = {
  role_id: number;
  libelle: string | null;
};

export type Avis = {
  avis_id: number;
  commentaire: string | null;
  note: string | null;
  statut: string | null;
};
