import React from 'react';
import './App.css'; 
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'; // This will now work after npm install

// Corrected import paths for components
import AddTaskForm from '../TaskForm/TaskForm';
import TaskDisplay from '../TaskTable/TaskTable';
import Login from '../Login/Login';           // Assuming Login.js is in src/components/Login
import Register from '../Register/Register';   // Assuming Register.js is in src/components/Register


// A simple function to check for the auth token
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// A wrapper for protected routes
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? <Component {...props} /> : <Redirect to="/login" />
    }
  />
);

// The layout for the main page with the todo list
const TodoPage = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
      <>
        <header>
          <h1>Basic ToDo List</h1>
          <button onClick={handleLogout} style={{float: 'right', margin: '10px'}}>Logout</button>
        </header>
        <main>
          <section>
            <h2>Add a Task</h2>
            <AddTaskForm />
          </section>
          <section>
            <h2>All Tasks</h2>
            <TaskDisplay />
          </section>
        </main>
      </>
    );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <PrivateRoute exact path="/" component={TodoPage} />
          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  );
}

export default App;