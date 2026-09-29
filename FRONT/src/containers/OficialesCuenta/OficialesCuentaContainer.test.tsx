import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import OficialesCuentaContainer from './OficialesCuentaContainer';



const mockStore = configureStore([]);

describe('OficialesCuentaContainer', () => {
  let store : any;

  beforeEach(() => {
    store = mockStore({
      user: {
        data: {
          rol: { codigo: 'EMP' }
        }
      },
      oficiales: {
        data: [
          {
            id: 1,
            origen: 'Interno',
            sucursal: 'Sucursal A',
            agente_colocador_descripcion: 'Agente X',
            descripcion: 'Cuenta 123',
            asignado: 50,
          },
        ],
        loading: false, 
      },
    });
  });

  test('should render the OficialesCuentaLists component with the correct data', () => {
    render(
      <Provider store={store}>
        <Router>
          <OficialesCuentaContainer />
        </Router>
      </Provider>
    );

 
    expect(screen.getByText('Interno')).toBeInTheDocument();
    expect(screen.getByText('Sucursal A')).toBeInTheDocument();
    expect(screen.getByText('Agente X')).toBeInTheDocument();
    expect(screen.getByText('Cuenta 123')).toBeInTheDocument();
    expect(screen.getByText('50 %')).toBeInTheDocument();


    const actionButtons = screen.getAllByRole('button').filter(button => {
      const icon = button.querySelector('svg');
      return icon?.getAttribute('data-icon') === 'link';
    });

    expect(actionButtons).toHaveLength(1); 
  });
});
