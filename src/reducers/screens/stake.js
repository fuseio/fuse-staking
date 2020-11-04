import { SELECT_VALIDATOR, WITHDRAW, DELEGATE } from '@/actions/consensus'

export default (state = {}, action) => {
  switch (action.type) {
    case WITHDRAW.REQUEST:
      return { ...state, isWithdraw: true }
    case WITHDRAW.SUCCESS:
      return { ...state, isWithdraw: false }
    case WITHDRAW.FAILURE:
      return { ...state, isWithdraw: false, failReason: 'Oops' }
    case DELEGATE.REQUEST:
      return { ...state, isDelegate: true }
    case DELEGATE.SUCCESS:
      return { ...state, isDelegate: false }
    case DELEGATE.FAILURE:
      return { ...state, isDelegate: false, failReason: 'Oops' }
    case SELECT_VALIDATOR:
      return { ...state, validator: action.address }
    default:
      return state
  }
}
