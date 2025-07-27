// src/redux/_root.reducer.js
import { combineReducers } from 'redux';
import taskList from './task.reducer';
import categoryList from './category.reducer';

// rootReducer is the primary reducer for our entire project
// It bundles up all of the other reducers so our project can use them.
// This is imported in index.js as rootSaga

const rootReducer = combineReducers({
  taskList,
  categoryList,
});

export default rootReducer;