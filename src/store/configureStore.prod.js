import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware, { END } from 'redux-saga'
import { createBrowserHistory } from 'history'

import rootReducer from '../reducers'

export default function configureStore (initialState) {
  const history = createBrowserHistory()
  const sagaMiddleware = createSagaMiddleware({})

  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      sagaMiddleware
    )
  )

  store.runSaga = sagaMiddleware.run
  store.close = () => store.dispatch(END)
  return { store, history }
}
