import useSwr from 'swr';
import fetch from 'isomorphic-unfetch';

export const fetcher = url => fetch(url).then(response => response.json());

export const useUser = () => {
  const { data, error, mutate } = useSwr('/api/user', fetcher);
  const loading = !data && !error;
  const user = data?.user;
  return { user, loading, mutate };
};
