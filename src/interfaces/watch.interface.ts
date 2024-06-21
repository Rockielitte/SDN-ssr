import { Brand } from "./brand.interface";

export interface Watch {
  name: string;
    image: string;
    price: number;
    automatic: boolean;
    description: { type: String, require: true },
    comments?: [Comment]; 
    brand: string | Brand;
}