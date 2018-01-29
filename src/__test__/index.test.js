import React from 'react';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import styled from 'styled-components';
import screenshot from '..';

expect.extend({
  toMatchImageSnapshot
});

const Box = styled.div`
  background-color: red;
  height: 500px;
  width: 500px;
`;

it('renders', async () => {
  expect(await screenshot(<Box />)).toMatchImageSnapshot();
});
