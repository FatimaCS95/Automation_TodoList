// src/redux/todo.watcher.saga.js
import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// --- Helper Function to Get Auth Headers ---
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'x-auth-token': token,
    },
  };
};

// --- Worker Sagas ---

// Gets all categories from the server
function* fetchCategories() {
  try {
    const config = getAuthConfig();
    const response = yield axios.get('/api/category', config);
    yield put({ type: 'SET_CATEGORY_LIST', payload: response.data });
  } catch (error) {
    console.error('Failed to get task categories:', error);
  }
}

// Gets all tasks from the server
function* fetchTasks() {
  try {
    const config = getAuthConfig();
    const response = yield axios.get('/api/task', config);
    yield put({ type: 'SET_TASK_LIST', payload: response.data });
  } catch (error) {
    console.error('Failed to get task list:', error);
  }
}

// Adds a new task using the server API
function* addNewTask(action) {
  try {
    const config = getAuthConfig();
    yield axios.post('/api/task/', action.payload, config);
    yield put({ type: 'FETCH_TASK_LIST' });
  } catch (error) {
    console.error('Failed to add new task:', error);
  }
}

// Deletes a task by id using the server API
function* deleteTask(action) {
  try {
    const config = getAuthConfig();
    yield axios.delete(`/api/task/${action.payload.id}`, config);
    yield put({ type: 'FETCH_TASK_LIST' });
  } catch (error) {
    console.error('Failed to delete task:', error);
  }
}

// Updates a task's 'complete' status by id
function* updateTask(action) {
  try {
    const config = getAuthConfig();
    yield axios.put(`/api/task/${action.payload.id}`, action.payload, config);
    yield put({ type: 'FETCH_TASK_LIST' });
  } catch (error) {
    console.error('Failed to update task:', error);
  }
}

// --- THIS IS THE NEW WORKER SAGA FOR EDITING A TASK'S DESCRIPTION ---
function* editTaskDescription(action) {
  try {
    const config = getAuthConfig(); // Get auth headers
    const { id, description } = action.payload; // Destructure payload to get id and new description
    
    // Make a PUT request, sending ONLY the description in the body.
    // This matches the logic in our updated server-side PUT route.
    yield axios.put(`/api/task/${id}`, { description }, config);
    
    // Refresh the task list to show the change
    yield put({ type: 'FETCH_TASK_LIST' });
  } catch (error) {
    console.error('Failed to edit task description:', error);
  }
}
// ---------------------------------------------------------------------


// --- Watcher Saga ---
function* todoWatcherSaga() {
  yield takeLatest('FETCH_CATEGORY_LIST', fetchCategories);
  yield takeLatest('FETCH_TASK_LIST', fetchTasks);
  yield takeLatest('ADD_TASK', addNewTask);
  yield takeLatest('DELETE_TASK', deleteTask);
  yield takeLatest('UPDATE_TASK', updateTask);

  // --- THIS LINE IS CRITICAL ---
  // Ensure this line was added to your saga
  yield takeLatest('EDIT_TASK', editTaskDescription); 
}

export default todoWatcherSaga;