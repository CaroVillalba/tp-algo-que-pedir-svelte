
export interface LocalAccount {
  id?: number;
  name: string;
  imgURL: string;
  street: string;
  number: number;
  latitude: number;
  longitude: number;
  appCommission: number;
  authorCommission: number;
  paymentMethods: string[];
}
