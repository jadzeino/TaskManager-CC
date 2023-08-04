import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserContextProps } from './types';
import { createUserApi } from '../apis/createUserApi';
import { loginUserApi } from '../apis/loginUserApi';
import { UserListContext } from './UserListContext';


const UserContext = createContext<UserContextProps>({
  user: null,
  login: async () => {},
  logout: () => {},
  createUser: async () => {},
  isLoggedIn: false
});

export const useUserContext = () => useContext(UserContext);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { addUserToList } = useContext(UserListContext);

  // Load user and isLoggedIn data from local storage on initial mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedIsLoggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, []);
  
  const login = async (email: string, password: string) => {
    try {
      const userFromServer = await loginUserApi(email, password);
      const newUser: User = {
        id: userFromServer.id,
        username: userFromServer.username,
      };
      setUser(newUser);
      setIsLoggedIn(true);
      // After successful login, save user and isLoggedIn data to local storage
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('isLoggedIn', 'true');
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);

    // Remove user and isLoggedIn data from local storage on logout
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
  };

  const createUser = async (name: string, email: string, password: string) => {
    try {
      const userFromServer = await createUserApi(name, email, password);
      const newUser: User = {
        id: userFromServer.id,
        username: userFromServer.username,
      };
      setUser(newUser);
      // After successfully creating the user, add it to the userList
      addUserToList({
        id: userFromServer.id,
        name: userFromServer.username,
      });
    } catch (error) {
      console.error('Error during user creation:', error);
      throw error;
    }
  };
  
  return (
    <UserContext.Provider value={{ user, login, logout, createUser,isLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
}
