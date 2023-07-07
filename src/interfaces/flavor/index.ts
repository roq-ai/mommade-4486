import { ProductInterface } from 'interfaces/product';
import { GetQueryInterface } from 'interfaces';

export interface FlavorInterface {
  id?: string;
  name: string;
  availability?: boolean;
  product_id?: string;
  created_at?: any;
  updated_at?: any;

  product?: ProductInterface;
  _count?: {};
}

export interface FlavorGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  product_id?: string;
}
