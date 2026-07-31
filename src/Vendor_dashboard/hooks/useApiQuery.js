import { useQuery } from "@tanstack/react-query";

export default function useApiQuery(key, fetcher, options = {}) {
  return useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      const result = await fetcher();
      return result;
    },
    ...options,
  });
}
