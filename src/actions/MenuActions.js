export const setMenuState = (menuState) => {
  return {
    type: 'Update_Menu_State',
    payload: menuState
  };
};

export const resetMenuState = () => {
  return {
    type: 'Reset_Menu_State'
  };
};
