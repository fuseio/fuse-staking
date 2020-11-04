import * as consensus from '@/actions/consensus'

export default (state = {}, action) => {
  switch (action.type) {
    case consensus.GET_VALIDATORS.SUCCESS:
      return { ...state, numberOfValidators: action.response.numberOfValidators }
    case consensus.GET_TOTAL_STAKE_AMOUNT.SUCCESS:
      return { ...state, ...action.response }
    case consensus.GET_BLOCK_REWARD_AMOUNT.SUCCESS:
      return { ...state, ...action.response }
    default:
      return state
  }
}
