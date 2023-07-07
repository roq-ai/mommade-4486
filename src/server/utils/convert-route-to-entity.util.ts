const mapping: Record<string, string> = {
  contacts: 'contact',
  flavors: 'flavor',
  organizations: 'organization',
  products: 'product',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
