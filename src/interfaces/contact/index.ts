import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface ContactInterface {
  id?: string;
  phone: string;
  address: string;
  organization_id?: string;
  created_at?: any;
  updated_at?: any;

  organization?: OrganizationInterface;
  _count?: {};
}

export interface ContactGetQueryInterface extends GetQueryInterface {
  id?: string;
  phone?: string;
  address?: string;
  organization_id?: string;
}
