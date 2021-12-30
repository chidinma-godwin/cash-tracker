import { render } from '@testing-library/react';
import Layout from '../layout';

describe('Layout', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <Layout>
        <div className='children' />
      </Layout>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
