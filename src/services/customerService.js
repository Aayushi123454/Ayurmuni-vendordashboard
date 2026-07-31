import API from "./api";

const buildQuery = (params = {}) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.append(key, value);
    }
  });
  const query = search.toString();
  return query ? `?${query}` : "";
};

export const customerService = {
  list: (params = {}) => API.get(`/vendors/customers/${buildQuery(params)}`),

  get: (id) => API.get(`/vendors/customers/${buildQuery({ id })}`),
};
