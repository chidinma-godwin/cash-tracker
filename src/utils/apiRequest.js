import {
  unexpected,
  wrongInput,
  notFound,
  unauthenticated,
} from 'constants/errorMessages';

const apiRequest = async (url, body) => {
  let err = '';
  const response = await fetch(url, {
    method: body ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (response.status === 400) {
    err = wrongInput;
  } else if (response.status === 500) {
    err = unexpected;
  } else if (response.status === 404) {
    err = notFound;
  } else if (response.status === 401) {
    err = unauthenticated;
  } else {
    err = unexpected;
  }
  return { response, err };
};

export default apiRequest;
