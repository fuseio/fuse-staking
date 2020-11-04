import { call, put, takeEvery, delay } from 'redux-saga/effects'
import keyBy from 'lodash/keyBy'

export const createEntityPut = (entity) => (action) => put({ ...action, entity })

export const entityKeys = {
  validators: 'address'
}

function * tryClause (args, error, action, numberOfTries = 1) {
  yield put({
    ...args,
    error,
    type: action.FAILURE
  })
  args = { ...args, numberOfTries: args.numberOfTries ? args.numberOfTries + 1 : 1 }
  if (args.numberOfTries < numberOfTries) {
    yield delay(500)
    yield put(args)
  }
}

export function tryCatch (action, saga, numberOfTries) {
  return function * wrappedTryCatch (args) {
    try {
      yield saga(args)
    } catch (error) {
      yield tryClause(args, error, action, numberOfTries)
    }
  }
}

export const tryTakeEvery = (action, saga, numberOfTries) => takeEvery(action.REQUEST, tryCatch(action, saga, numberOfTries))

export const createEntitiesFetch = (action, apiFunc) => function * (params) {
  const entity = params.entity
  if (!entity) {
    throw Error(`No entity name given for action ${action.REQUEST}`)
  }

  const response = yield call(apiFunc, params)

  const { data, ...metadata } = response

  const dataArray = Array.isArray(data) ? data : [data]
  const entities = keyBy(dataArray, entityKeys[entity])
  const result = Object.keys(entities)

  yield put({
    ...params,
    type: action.SUCCESS,
    response: {
      entities,
      result,
      metadata
    }
  })

  return { ...data, ...params }
}
