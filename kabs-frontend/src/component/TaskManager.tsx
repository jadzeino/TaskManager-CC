import React from "react";
import { useTaskActionsContext } from "../context/TaskActionsContext";
import EditTaskForm from "./EditTaskForm";
import AssignTaskForm from "./AssignTaskForm";
import TaskHistory from "./TaskHistory";
import { updateTaskTitleAndDescription } from "../apis/updateTaskTitleAndDescriptionApi";
import { useUserContext } from "../context/UserContext";
import { Task } from "../types/TaskType";

const TaskManager = ({updateTasks,handleAssignTask}:{updateTasks:(upatedTask: Task)=>void,handleAssignTask:(taskId: number, selectedUser: string) => void}) => {
  const {
    currentActionData,
    showEditForm,
    showAssignForm,
    showHistory,
    reset,
  } = useTaskActionsContext();

  const { user } = useUserContext();
  
  if(!showEditForm && !showAssignForm && !showHistory){
    return null
  }

  const handleUpdateTaskTitleAndDescription = async (taskId: number, newTitle: string, newDescription: string) => {
    try {
       await updateTaskTitleAndDescription(taskId,newTitle,newDescription,user ? parseInt(user.id, 10) : 0) 
      
      updateTasks({ ...currentActionData.task as any, title: newTitle, description: newDescription });
     
    } catch (error) {
      console.error('Error updating task title and description:', error);
    }
  };

  return (
    <>
      {showEditForm && (
        <EditTaskForm
          open={showEditForm}
          onClose={reset}
          task={currentActionData.task!} // Assuming a task is always provided when the form is opened
          onUpdateTaskTitleAndDescription={handleUpdateTaskTitleAndDescription}
        />
      )}
      {showAssignForm && (
        <AssignTaskForm
          onClose={reset}
          task={currentActionData.task!}
          handleAssignTask={handleAssignTask}
          updatedBy={user ? parseInt(user.id, 10): 0}
        />
      )}
      {showHistory && <TaskHistory onClose={reset} task={currentActionData.task!} />}
    </>
  );
};

export default TaskManager;
