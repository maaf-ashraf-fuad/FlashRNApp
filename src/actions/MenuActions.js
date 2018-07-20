export const setMenuState = (menuState) => {
  return {
    type: 'Update_Menu_State',
    payload: menuState
  };
};

export const setMenuAnchor = ( coordinate ) => {
  return {
    type: 'Update_Menu_Anchor',
    payload: coordinate
  };
};
