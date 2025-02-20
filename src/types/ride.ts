
export type Driver = {
  id: number;
  name: string;
  rating: number;
  photoUrl: string;
  preferences: string[];
  reviews: Review[];
};

export type Vehicle = {
  brand: string;
  model: string;
  energyType: "Essence" | "Diesel" | "Électrique" | "Hybride";
};

export type Review = {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
};

export type Ride = {
  id: string;  // Changed from number to string
  driver: Driver;
  vehicle: Vehicle;
  availableSeats: number;
  price: number;
  departureTime: string;
  arrivalTime: string;
  departureCity: string;
  arrivalCity: string;
  isEcological: boolean;
};
