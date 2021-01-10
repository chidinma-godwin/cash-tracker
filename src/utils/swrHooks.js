import useSwr from 'swr';

// CashTracker imports
import { userEndpoint, transactionEndpoint } from 'constants/endpoints';

export const fetcher = async url => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error();
    error.status = res.status;
    throw error;
  }
  return res.json();
};

export const useUser = () => {
  const { data, error, mutate } = useSwr(userEndpoint, fetcher);
  const loading = !data && !error;
  const user = data?.user;
  return { user, loading, mutate };
};

export const useTransaction = id => {
  const { data, error, mutate } = useSwr(
    `${transactionEndpoint}/${id}`,
    fetcher
  );
  const loading = !data && !error;
  const transactions = data?.transactions;
  return { transactions, loading, mutate };
};
