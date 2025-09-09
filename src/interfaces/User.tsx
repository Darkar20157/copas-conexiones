export interface User {
  id: number;
  state: string;
  name: string;
  birthdate: Date;
  description: string;
  phone: string;
  gender: string;
  photos?: string[];
}