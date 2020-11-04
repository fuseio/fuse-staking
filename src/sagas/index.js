import { all, fork } from 'redux-saga/effects'

import networkSaga from './network'
import accountsSaga from './accounts'
import consensusSaga from './consensus'

export default function * rootSaga () {
  yield all([
    fork(networkSaga),
    fork(accountsSaga),
    fork(consensusSaga)
  ])
}
