import { FlavorInterface } from 'interfaces/flavor';
import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface ProductInterface {
  id?: string;
  name: string;
  image: string;
  organization_id?: string;
  created_at?: any;
  updated_at?: any;
  flavor?: FlavorInterface[];
  organization?: OrganizationInterface;
  _count?: {
    flavor?: number;
  };
}

export interface ProductGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  image?: string;
  organization_id?: string;
}
