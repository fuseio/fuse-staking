
import React from 'react'
import { ModalProvider } from 'react-modal-hook'
import { TransitionGroup } from 'react-transition-group'
import { Provider } from 'react-redux'
import Root from '@/containers/Root.jsx'
import rootSaga from '@/sagas/index'
import configureStore from '@/store/configureStore'

const { store } = configureStore(window.__INITIAL_STATE__)

store.runSaga(rootSaga)

const App = () => (
  <ModalProvider rootComponent={TransitionGroup}>
    <Provider store={store}>
      <Root />
    </Provider>
  </ModalProvider>
)

export default App
