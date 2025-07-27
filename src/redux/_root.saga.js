// src/redux/_root.saga.js
import { all } from 'redux-saga/effects';
import todoWatcherSaga from './todo.watcher.saga';

// rootSaga is the primary saga that bundles up all of the other sagas
// from our project so we can run them all at once
export default function* rootSaga() {
  yield all([
    todoWatcherSaga(),
    // add other sagas here
  ]);
}