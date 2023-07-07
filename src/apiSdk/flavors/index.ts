import axios from 'axios';
import queryString from 'query-string';
import { FlavorInterface, FlavorGetQueryInterface } from 'interfaces/flavor';
import { GetQueryInterface } from '../../interfaces';

export const getFlavors = async (query?: FlavorGetQueryInterface) => {
  const response = await axios.get(`/api/flavors${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createFlavor = async (flavor: FlavorInterface) => {
  const response = await axios.post('/api/flavors', flavor);
  return response.data;
};

export const updateFlavorById = async (id: string, flavor: FlavorInterface) => {
  const response = await axios.put(`/api/flavors/${id}`, flavor);
  return response.data;
};

export const getFlavorById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/flavors/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteFlavorById = async (id: string) => {
  const response = await axios.delete(`/api/flavors/${id}`);
  return response.data;
};
