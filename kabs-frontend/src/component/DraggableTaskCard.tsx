import React from 'react';
import { useDrag } from 'react-dnd';
import TaskCard from './TaskCard';
import { Task } from '../types/TaskType';
import { ItemTypes } from '../constants';

type DraggableTaskCardProps = {
  task: Task;
  updateTasks:(updatedTask:Task)=>void
  handleAssignTask:(taskId:number,selectedUser:string)=>void
};

const DraggableTaskCard: React.FC<DraggableTaskCardProps> = ({ task,updateTasks,handleAssignTask }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { task },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} draggable style={{ opacity: isDragging ? 0.5 : 1 }}>
      <TaskCard task={task} updateTasks={updateTasks} handleAssignTask={handleAssignTask} />
    </div>
  );
};

export default DraggableTaskCard;
