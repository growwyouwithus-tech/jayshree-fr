// Add this function before the authSlice
export const checkAuth = () => (dispatch, getState) => {
  const { token } = getState().auth;
  return !!token;
};