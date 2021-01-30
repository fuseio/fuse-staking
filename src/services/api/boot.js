import request from 'superagent'

export const fetchAllNodes = () =>
  request.get(`${CONFIG.api.boot}/nodes`).then(response => response.body)

export const fetchOldNodes = () =>
  request.get(`${CONFIG.api.boot}/oldNodes`).then(response => response.body)

export const fetchNodeByAddress = ({ address }) =>
  request.get(`${CONFIG.api.boot}/node=${address}`).then(response => response.body)

export const fetchDelegatedNodes = () =>
  request.get(`${CONFIG.api.boot}/delegatedNodes`).then(response => response.body)

export const fetchDelegatedNodesSorted = () =>
  request.get(`${CONFIG.api.boot}/delegatedNodes_sorted`).then(response => response.body)
