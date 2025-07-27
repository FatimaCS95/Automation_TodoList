// src/components/TaskTable/TaskTable.jsx

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';

function TaskTable() {
  const dispatch = useDispatch();
  const taskList = useSelector((store) => store.taskList);
  const [editingTask, setEditingTask] = useState({ id: null, description: '' });

  useEffect(() => {
    dispatch({ type: 'FETCH_TASK_LIST' });
  }, [dispatch]);

  const formatDate = (date) => (date ? moment(date).format('MM/DD/YYYY') : '');

  const handleSaveEdit = () => {
    dispatch({ type: 'EDIT_TASK', payload: { id: editingTask.id, description: editingTask.description } });
    setEditingTask({ id: null, description: '' });
  };
  
  // --- ADDED FOR TESTING ---
  // A helper function to create a clean, unique ID from the task description for our data-cy attributes.
  // "Submit final draft" becomes "submit-final-draft".
  const createTestId = (text) => text.replace(/\s+/g, '-').toLowerCase();

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Task</TableCell>
          <TableCell>Category</TableCell>
          <TableCell>Due Date</TableCell>
          <TableCell colSpan={2} align="center">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {taskList.map((item) => (
          <TableRow key={item.id}>
            {editingTask.id === item.id ? (
              <TableCell>
                <TextField
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  // --- MODIFIED FOR TESTING ---
                  // This lets Cypress find the text field when editing.
                  inputProps={{ 'data-cy': 'edit-task-input' }}
                />
              </TableCell>
            ) : (
              <TableCell>{item.description}</TableCell>
            )}
            <TableCell>{item.category_name}</TableCell>
            <TableCell>{formatDate(item.due)}</TableCell>

            {editingTask.id === item.id ? (
              // This is the view when a row is being edited
              <TableCell colSpan={2} align="center">
                {/* --- MODIFIED FOR TESTING --- */}
                <Button variant="contained" color="primary" onClick={handleSaveEdit} data-cy="save-edit-button">
                  Save
                </Button>
                <Button onClick={() => setEditingTask({ id: null, description: '' })}>
                  Cancel
                </Button>
              </TableCell>
            ) : (
              // This is the default view for a row
              <>
                <TableCell>
                  {/* --- MODIFIED FOR TESTING --- */}
                  <Button
                    variant="contained"
                    onClick={() => setEditingTask({ id: item.id, description: item.description })}
                    data-cy={`edit-button-${createTestId(item.description)}`}
                  >
                    Edit
                  </Button>
                </TableCell>
                <TableCell>
                  {/* --- MODIFIED FOR TESTING --- */}
                  <Button
                    variant="contained"
                    onClick={() => dispatch({ type: 'DELETE_TASK', payload: { id: item.id } })}
                    data-cy={`delete-button-${createTestId(item.description)}`}
                  >
                    Delete Task
                  </Button>
                </TableCell>
              </>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default TaskTable;