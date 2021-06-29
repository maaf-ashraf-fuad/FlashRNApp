import { NavigationActions, StackActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

function popToTop() {
  _navigator.dispatch(
    StackActions.popToTop()
  );
}

function back() {
  _navigator.dispatch(
    NavigationActions.back()
  );
}

function replace(routeName, params) {
  _navigator.dispatch(
    StackActions.replace({
      routeName,
      params,
    })
  );
}

function push(routeName, params) {
  _navigator.dispatch(
    StackActions.push({
      routeName,
      params,
    })
  );
}

function pop() {
  _navigator.dispatch(
    StackActions.pop({ n: 1 })
  );
}

// add other navigation functions that you need and export them

export default {
  navigate,
  popToTop,
  replace,
  push,
  pop,
  back,
  setTopLevelNavigator,
};
