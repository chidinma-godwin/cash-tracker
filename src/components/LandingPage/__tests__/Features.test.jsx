import { render } from '@testing-library/react';
import Features from '../Features';

describe('Features', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Features />);
    expect(asFragment(<Features />)).toMatchSnapshot();
  });
});
