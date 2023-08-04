import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getUsersList } from '../apis/getUserListApi';

type User = {
  id: number;
  name: string;
  email?: string;
};

type UserListContextType = {
  userList: User[];
  addUserToList: (newUser: User) => void;
};

const UserListContext = createContext<UserListContextType>({
  userList: [],
  addUserToList: () => {},
});

const UserListProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    fetchUserList();
  }, []);

  const fetchUserList = async () => {
    try {
        const data = await getUsersList();
        setUserList(data);
      } catch (error) {
        console.error('Error fetching user list:', error);
      }
  };

  const addUserToList = (newUser: User) => {
    setUserList((prevUserList) => [...prevUserList, newUser]);
  };

  return (
    <UserListContext.Provider value={{ userList, addUserToList }}>
      {children}
    </UserListContext.Provider>
  );
};

export { UserListContext, UserListProvider };
