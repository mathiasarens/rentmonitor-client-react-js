import React from 'react';
import ReactDOM from 'react-dom';
import Welcome from './Signup';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Signup />, div);
  ReactDOM.unmountComponentAtNode(div);
});
