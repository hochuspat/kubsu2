const initialState = {
  auth: 'authorized'
}

export default reducer = (state=initialState, action) => {
  switch (action.type) {
    case 'AUTHORIZED':
      return {
        ...state, 
        auth: 'authorized'
      }
    case 'UNAUTHORIZED':
      return {
        ...state,
        auth: 'unauthorized'
      }
    default: return state
  }
}