
export type Driver = {
  id: number;
  name: string;
  rating: number;
  photoUrl: string;
};

export type Ride = {
  id: number;
  driver: Driver;
  availableSeats: number;
  price: number;
  departureTime: string;
  arrivalTime: string;
  departureCity: string;
  arrivalCity: string;
  isEcological: boolean;
};
