export interface User {
  id: number;
  state: string;
  name: string;
  age: Date;
  description: string;
  phone: string;
  photos?: string[];
}