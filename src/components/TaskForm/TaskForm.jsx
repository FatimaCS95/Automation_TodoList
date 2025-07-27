// src/components/TaskForm/TaskForm.jsx

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

const useStyles = makeStyles((theme) => ({
  form: { '& > *': { margin: theme.spacing(1) } },
  task: { width: '40ch' },
  select: { minWidth: '15ch' }
}));

function TaskForm() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const categoryList = useSelector((store) => store.categoryList);

  useEffect(() => {
    dispatch({ type: 'FETCH_CATEGORY_LIST' });
  }, [dispatch]);

  const defaultTask = { description: '', category: '', due: null };
  const [task, setTask] = useState(defaultTask);

  const handleDateChange = (moment) => {
    const dateValue = moment ? moment.format('YYYY-MM-DD') : null;
    setTask({ ...task, due: dateValue });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!task.category) {
        alert('Please select a category');
        return;
    }
    dispatch({ type: 'ADD_TASK', payload: task });
    setTask(defaultTask);
  };

  return (
    <form onSubmit={handleSubmit} className={classes.form} autoComplete="off">
      <TextField
        required
        className={classes.task}
        label="Description"
        value={task.description}
        onChange={(event) => setTask({ ...task, description: event.target.value })}
        // --- MODIFIED FOR TESTING ---
        // This gives Cypress a reliable hook for the description input.
        inputProps={{ 'data-cy': 'task-description-input' }}
      />

      <FormControl required>
        <InputLabel id="task-category-label">Category</InputLabel>
        <Select
          className={classes.select}
          labelId="task-category-label"
          value={task.category}
          onChange={(event) => setTask({ ...task, category: event.target.value })}
        >
          {categoryList.map(item => (
            <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <MuiPickersUtilsProvider utils={MomentUtils}>
        <KeyboardDatePicker
          variant="inline"
          format="MM/DD/YYYY"
          label="Due Date"
          value={task.due}
          onChange={handleDateChange}
          // --- MODIFIED FOR TESTING ---
          // This gives Cypress a reliable hook for the date input.
          data-cy="task-due-date-input"
        />
      </MuiPickersUtilsProvider>

      {/* --- MODIFIED FOR TESTING --- */}
      {/* This gives Cypress a reliable hook for the submit button. */}
      <Button type="submit" variant="contained" color="primary" data-cy="task-submit-button">
        Save
      </Button>
    </form>
  );
}

export default TaskForm;