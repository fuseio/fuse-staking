import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import network from './network'
import accounts from './accounts'
import consensus from './consensus'
import screens from './screens'
import entities from './entities'

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  network,
  accounts,
  consensus,
  screens,
  entities
})

export default createRootReducer
