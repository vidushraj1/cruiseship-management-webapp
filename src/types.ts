export type PassengerType = 'ADULT' | 'CHILD';

export interface Passenger {
  firstName: string;
  surname: string;
  expenses: number;
  type: PassengerType;
}

export interface Cabin {
  cabinNumber: number;
  cabinName: string;
  passengers: Passenger[];
}