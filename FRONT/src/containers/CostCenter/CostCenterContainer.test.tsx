import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import CostsCenterContainer from './CostContainer';
import rootReducer from '../../redux/reducers/rootReducer';
import { CostsCenterProps } from '../../components/interfaces/costsCenterInterfaces';

const initialState = {
  costsCenter: {
    data: [
      { id: 1, descripcion: 'Centro 1', tipo: 'F' },
      { id: 2, descripcion: 'Centro 2', tipo: 'G' },
    ],
    loading: false,
    error: null,
  },
};

const renderComponent = (props: Partial<CostsCenterProps> = {}) => {
  const store = createStore(rootReducer, initialState);

  render(
    <Provider store={store}>
    <CostsCenterContainer 
      getAllCenterAction={() => {}}
      deleteCenterAction={() => {}}
      updateCenterAction={() => {}}
      createCenterAction={() => {}} 
      data={initialState.costsCenter.data}
      {...props}
    />
  </Provider>
);
};

describe('CostsCenterContainer', () => {
  it('should render the component with data', () => {
    renderComponent();
    

    expect(screen.getByText('Centro 1')).toBeInTheDocument();
    expect(screen.getByText('Centro 2')).toBeInTheDocument();
  });

  it('should render the table with the correct columns', () => {
    renderComponent();

    expect(screen.getByRole('columnheader', { name: /Id/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Descripción/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Tipo/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Acción/i })).toBeInTheDocument();
  });

  it('should render the edit and delete buttons', () => {
    renderComponent();


    const editButtons = screen.getAllByRole('button', { name: /Modificar/i });
    const deleteButtons = screen.getAllByRole('button', { name: /Eliminar/i });

    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });
});