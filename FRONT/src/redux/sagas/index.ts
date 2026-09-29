import { all } from 'redux-saga/effects';
import { watchExample } from './example.sagas';
import { watchCenter } from './costsCenter.sagas';
import { watchEmpleados } from './empleados.sagas';
import { watchOficiales } from './oficiales.sagas';
import { watchUser } from './user.sagas';
import { watchAltas } from './altas.sagas';

export default function* rootSaga(): Generator {
  yield all([
    watchExample(),
    watchCenter(),
    watchUser(),
    watchEmpleados(),
    watchOficiales(),
    watchAltas(),
  ]);
}
