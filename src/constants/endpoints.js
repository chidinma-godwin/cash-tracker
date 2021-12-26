const BASE_PATH =
  process.env.NODE_ENV === 'production'
    ? `http://${process.env.HOST}:${process.env.PORT}`
    : 'http://localhost:3000';

export const loginEndpoint = `${BASE_PATH}/api/login`;
export const signupEndpoint = `${BASE_PATH}/api/signup`;
export const userEndpoint = `${BASE_PATH}/api/user`;
export const transactionEndpoint = `${BASE_PATH}/api/transaction`;
export const dashboardEndpoint = `${BASE_PATH}/dashboard`;
