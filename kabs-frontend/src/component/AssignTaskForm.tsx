import React, { useContext, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { Task } from '../types/TaskType';
import { UserListContext } from '../context/UserListContext';
import { assignTask } from '../apis/assignTaskApi';

type AssignTaskFormProps = {
  task: Task;
  onClose: () => void;
  handleAssignTask: (taskId: number, assignedTo: string) => void;
  updatedBy:number
};

const AssignTaskForm: React.FC<AssignTaskFormProps> = ({ task, onClose, handleAssignTask,updatedBy }) => {
  const { userList } = useContext(UserListContext);
  const [selectedUser, setSelectedUser] = useState<string>(task.assignedTo || 'unAssigned');

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setSelectedUser(event.target.value as string);
  };

  const handleAssignTaskApi = async () => {
   
    try {
        const user = userList.find((user)=>user.name===selectedUser)
        const userId= user?.id || "unAssigned"
        const assignedUserName= user?.name || "unAssigned"

        await assignTask(task.id,userId,updatedBy,assignedUserName)
        handleAssignTask(task.id, selectedUser);
        onClose();
    } catch (error) {
      console.error('Error assigning task:', error);
    }
  };

  if(!userList || userList.length<1){
    return <div>Loading please wait ...</div>
  }

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Assign Task</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel>Assign To</InputLabel>
          <Select value={selectedUser} onChange={handleSelectChange}>
            <MenuItem value="unAssigned">Unassigned</MenuItem>
            {userList.map((user) => (
              <MenuItem key={user.id} value={user.name}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAssignTaskApi} color="primary">
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignTaskForm;
