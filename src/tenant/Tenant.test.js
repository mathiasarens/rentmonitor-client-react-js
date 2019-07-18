import React from 'react';
import ReactDOM from 'react-dom';
import Tenant from './TenantEditor';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TenantEditor />, div);
  ReactDOM.unmountComponentAtNode(div);
});
