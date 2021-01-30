import { createRequestTypes, requestAction, createEntityAction, createTransactionRequestTypes, action } from './utils'

const validatorsAction = createEntityAction('validators')

export const GET_TOTAL_STAKE_AMOUNT = createRequestTypes('GET_TOTAL_STAKE_AMOUNT')
export const GET_VALIDATORS = createRequestTypes('GET_VALIDATORS')
export const GET_OLD_VALIDATORS = createRequestTypes('GET_OLD_VALIDATORS')
export const FETCH_VALIDATOR_METADATA = createRequestTypes('FETCH_VALIDATOR_METADATA')
export const GET_BLOCK_REWARD_AMOUNT = createRequestTypes('GET_BLOCK_REWARD_AMOUNT')
export const GET_BLOCK_REWARD_AMOUNT_PER_VALIDATOR = createRequestTypes('GET_BLOCK_REWARD_AMOUNT_PER_VALIDATOR')
export const WITHDRAW = createTransactionRequestTypes('WITHDRAW')
export const DELEGATE = createTransactionRequestTypes('DELEGATE')
export const GET_BLOCK_NUMBER = createRequestTypes('GET_BLOCK_NUMBER')
export const SELECT_VALIDATOR = 'SELECT_VALIDATOR'

export const fetchValidatorMetadata = (address) => validatorsAction(FETCH_VALIDATOR_METADATA.REQUEST, { address })
export const getBlockRewardAmountPerValidator = (address) => validatorsAction(GET_BLOCK_REWARD_AMOUNT_PER_VALIDATOR.REQUEST, { address })
export const getTotalStakeAmount = () => requestAction(GET_TOTAL_STAKE_AMOUNT)
export const getValidators = () => requestAction(GET_VALIDATORS)
export const getOldValidators = () => requestAction(GET_OLD_VALIDATORS)
export const getBlockRewardAmount = () => requestAction(GET_BLOCK_REWARD_AMOUNT)
export const getBlockNumber = () => requestAction(GET_BLOCK_NUMBER)

export const withdraw = (validatorAddress, amount) => action(WITHDRAW.REQUEST, { validatorAddress, amount })
export const delegate = (validatorAddress, amount) => action(DELEGATE.REQUEST, { validatorAddress, amount })
export const selectValidator = (address) => action(SELECT_VALIDATOR, { address })
