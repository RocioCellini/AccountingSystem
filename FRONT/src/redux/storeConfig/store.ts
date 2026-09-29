import { createStore, applyMiddleware, compose, Store } from "redux"
import { Middleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import createDebounce from "redux-debounced"
import thunk from "redux-thunk"
import rootReducer from "../reducers/rootReducer"
import rootSaga from "../sagas"
import redirectMiddleware from "../middleware/redirect.middleware"


const sagaMiddleware = createSagaMiddleware();
const middlewares: Middleware[] = [thunk, createDebounce(), sagaMiddleware , redirectMiddleware]

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store: Store = createStore(
  rootReducer,
  {},
  composeEnhancers(applyMiddleware(...middlewares))
);

sagaMiddleware.run(rootSaga);

export { store }