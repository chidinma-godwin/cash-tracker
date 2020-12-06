import '../styles/global.css';

// This default export is required in a new `pages/_app.js` file.
// eslint-disable-next-line react/prop-types
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
