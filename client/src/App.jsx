import { useState } from 'react'
import { gql } from '@apollo/client'
import { useMutation, useQuery } from '@apollo/client/react';

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      name
      age
      isMarried
    }
  }
`;

const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      name
      age
      isMarried
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $age: Int!, $isMarried: Boolean!) {
    createUser(name: $name, age: $age, isMarried: $isMarried) {
      id
      name
      age
      isMarried
    }
  }
`;




function App() {
  const [newUser, setNewUser] = useState({
    name: '',
    age: 0,
    isMarried: false,
  });

  const {
    data: getUsersData,
    loading: getUsersLoading,
    error: getUsersError,
    refetch: refetchUsers,
  } = useQuery(GET_USERS);

  const {
    data: getUserByIdData,
    loading: getUserByIdLoading,
    error: getUserByIdError,
  } = useQuery(GET_USER_BY_ID, {
    variables: { id: "1" }
  } 
  );

  const [createUser] = useMutation(CREATE_USER);

  const handleCreateUser = async () => {
    try {
      const { data } = await createUser({
        variables: {
          name: newUser.name,
          age: parseInt(newUser.age),
          isMarried: newUser.isMarried,
        },
      });

      console.log('User created:', data.createUser);

      // manually refresh the users list
      refetchUsers();

    } catch (error) {
      console.error('Error creating user:', error);
    }
  };  

  if (getUsersLoading) return <p>Data Loading...</p>;

  if (getUsersError) return <p>Error: {getUsersError.message}</p>;
  

  return (
    <>

      <div>
        <input type="text" placeholder='Name' onChange={
          (e) => {
            setNewUser((prev) => ({...prev, name: e.target.value}))
          }
        } />

        <input type="number" placeholder='Age' onChange={
          (e) => {
            setNewUser((prev) => ({...prev, age: e.target.value}))
          }
        } />

        <label>
          Married:
          <input type="checkbox" onChange={
          (e) => {
            setNewUser((prev) => ({...prev, isMarried: e.target.checked}))
          }
        } />
        </label>
        
        <button onClick={handleCreateUser}>
          Create User
        </button>
      </div>


      <div>
        {getUserByIdLoading ?
          <p>Loading chosen user...</p>
          : getUserByIdError ?
            <p>Error loading chosen user: {getUserByIdError.message}</p> 
        : 
        <div>

          <h1>Chosen User</h1>

          <p>Name: {getUserByIdData?.getUserById?.name}</p>

          <p>Age: {getUserByIdData?.getUserById?.age}</p>

          <p>Married: {getUserByIdData?.getUserById?.isMarried ? 'Yes' : 'No'}</p>
        
        </div>
        }
      </div>
      
      
      <h1>Users</h1>

      <div>
        {getUsersData?.getUsers?.map((user) => (
            <div key={user.id}>

                <p>Name: {user.name}</p>

                <p>Age: {user.age}</p>

                <p>Married: {user.isMarried ? 'Yes' : 'No'}</p>

            </div>
        ))
          }
      </div>
    </>
  )
}

export default App
