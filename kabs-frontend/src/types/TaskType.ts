export type Task = {
    id:number
    title: string;
    description: string;
    assignedTo?: string;
    assignedToName?: string;
    status: string;
    createdBy?: number,
    updatedBy?: number,
    createdAt: string,
    updatedAt?: string
  };

  export type CreateTask = {
    title: string;
    description: string;
    status: string;
    createdBy: number,    
  }