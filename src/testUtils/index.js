import React from 'react';
import { SWRConfig } from 'swr';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

// eslint-disable-next-line react/prop-types
const Wrapper = ({ children }) => (
  <SWRConfig value={{ dedupingInterval: 0 }}>{children}</SWRConfig>
);

const customRender = (ui, options) =>
  render(ui, { wrapper: Wrapper, ...options });

const customRenderHook = hook => renderHook(hook, { wrapper: Wrapper });

export * from '@testing-library/react';
export { customRenderHook as renderHook };
export { customRender as render };
