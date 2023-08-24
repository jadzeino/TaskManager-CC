import React, { createContext, useState, useContext, ReactNode } from "react";
import { Task } from "../types/TaskType";

interface TaskActionsContextType {
  showEditForm: boolean;
  showAssignForm: boolean;
  showHistory: boolean;
  openEditForm: () => void;
  closeEditForm: () => void;
  openAssignForm: () => void;
  closeAssignForm: () => void;
  openHistory: () => void;
  closeHistory: () => void;
}
interface CurrentTaskActionData {
  task?: Task;
  updatedBy?: number;
}

interface TaskActionsContextType {
  currentActionData: CurrentTaskActionData;

  showEditForm: boolean;
  showAssignForm: boolean;
  showHistory: boolean;
  openEditForm: () => void;
  closeEditForm: () => void;
  openAssignForm: () => void;
  closeAssignForm: () => void;
  openHistory: () => void;
  closeHistory: () => void;

  dispatchEditForm: (
    task: Task
  ) => void;
  dispatchAssignForm: (
    task: Task
  ) => void;
  dispatchHistory: (task: Task) => void;
  reset: () => void;
}

const TaskActionsContext = createContext<TaskActionsContextType | undefined>(
  undefined
);

export const TaskActionsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentActionData, setCurrentActionData] =
    useState<CurrentTaskActionData>({});

  const [showEditForm, setShowEditForm] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const value = {
    currentActionData,
    showEditForm,
    showAssignForm,
    showHistory,
    openEditForm: () => setShowEditForm(true),
    closeEditForm: () => setShowEditForm(false),
    openAssignForm: () => setShowAssignForm(true),
    closeAssignForm: () => setShowAssignForm(false),
    openHistory: () => setShowHistory(true),
    closeHistory: () => setShowHistory(false),

    dispatchEditForm: (task: Task) => {
      setShowEditForm(true);
      setCurrentActionData({ task});
    },
    dispatchAssignForm: (task: Task) => {
      setShowAssignForm(true);
      setCurrentActionData({ task });
    },
    dispatchHistory: (task: Task) => {
      setShowHistory(true);
      setCurrentActionData({ task });
    },
    reset: () => {
      setShowEditForm(false);
      setShowAssignForm(false);
      setShowHistory(false);
      setCurrentActionData({});
    },
  };

  return (
    <TaskActionsContext.Provider value={value}>
      {children}
    </TaskActionsContext.Provider>
  );
};

export const useTaskActionsContext = () => {
  const context = useContext(TaskActionsContext);
  if (!context) {
    throw new Error(
      "useTaskActionsContext must be used within a TaskActionsProvider"
    );
  }
  return context;
};
