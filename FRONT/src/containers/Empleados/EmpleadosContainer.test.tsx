import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import EmpleadosContainer from './EmpleadosContainer';

const mockStore = configureStore([]);

describe('EmpleadosContainer', () => {
  let store : any;

  beforeEach(() => {
    store = mockStore({
      user: {
        data: {
          rol: { codigo: 'EMP' }
        }
      },
      empleados: {
        data: [
          {
            id: 1,
            nombre_apellido: 'Juan Perez',
            legajo_bejerman: '123',
            legajo_sun: '456',
            empresa: { descripcion: 'Company A' },
            sector: { descripcion: 'Sector A' },
            ultimo_sueldo: 50000,
            es_favorito: false,
          },
        ],
      },
      loading: {
        isLoading: false,
        error: false,
      },
    });
  });

  test('should render the EmpleadosList component with the correct data', () => {
    render(
      <Provider store={store}>
        <Router>
          <EmpleadosContainer />
        </Router>
      </Provider>
    );


    expect(screen.getByText('Juan Perez')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('456')).toBeInTheDocument();
    expect(screen.getByText('Company A')).toBeInTheDocument();
    expect(screen.getByText('Sector A')).toBeInTheDocument();


    const actionButtons = screen.getAllByRole('button').filter(button => {
      const icon = button.querySelector('svg');
      return icon?.getAttribute('data-icon') === 'star' || icon?.getAttribute('data-icon') === 'link';
    });

    expect(actionButtons).toHaveLength(2); 
  });
});
