import { Action } from 'redux';

export interface ExampleState {
  data: any
  loading: boolean
}

export interface  ExampleSuccessAction extends Action<string> {
  data: any;
}

export interface ExampleErrorAction extends Action<string> {
  error: any;
}