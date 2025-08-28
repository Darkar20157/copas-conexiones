export interface User {
  id: number;
  state: string;
  name: string;
  age: number;
  description: string;
  phone: string;
  photos?: string[];
}