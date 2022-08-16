import { combineReducers } from 'redux'
import network from './network'
import accounts from './accounts'
import consensus from './consensus'
import screens from './screens'
import entities from './entities'

const rootReducer = combineReducers({
  network,
  accounts,
  consensus,
  screens,
  entities
})

export default rootReducer
