export interface User {
    id: string;
    username: string;
    email?: string
  }

  export interface AssignedUser {
    id: string;
    name: string;
    email: string
  }  
  
 export interface UserContextProps {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    createUser: (name: string, email: string, password: string) => Promise<void>;
    isLoggedIn: boolean;
  }