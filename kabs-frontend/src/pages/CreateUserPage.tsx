import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { isPasswordValid, isValidEmail } from '../utils/helpers';

function CreateUserPage() {
  const { createUser } = useUserContext();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const { isLoggedIn } = useUserContext();

  const passwordErrorMessage = password.length >0 ? isPasswordValid(password) : '';

  const handleCreateUser = async () => {
    try {
      // Validate input fields before creating user
      if (username.trim() === '') {
        setUsernameError(true);
        return;
      } else {
        setUsernameError(false);
      }

      if (!isValidEmail(email)) {
        setEmailError(true);
        return;
      } else {
        setEmailError(false);
      }

      if (isPasswordValid(password).length>0) {
        setPasswordError(true);
        return;
      } else {
        setPasswordError(false);
      }

      await createUser(username, email, password);
      if(isLoggedIn){
        navigate('/dashboard');
      }else{
        navigate('/login');
      }
      
    } catch (error) {
      // Handle any errors that might occur during user creation
      console.error('Error during user creation:', error);
      setErrorMessage('User creation failed. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Create User
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            data-testid={"username-text-field"}
            label="Username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={usernameError}
            helperText={usernameError ? 'Username cannot be empty' : ''}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            data-testid={"email-text-field"}
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            helperText={emailError ? 'Please enter a valid email address' : ''}
          />
          <TextField
            type="password"
            margin="normal"
            required
            data-testid={"password-text-field"}
            fullWidth
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError || passwordErrorMessage !== ''}
            helperText={passwordError ? 'Password must be at least 8 characters long' : passwordErrorMessage}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleCreateUser}
          >
            Create User
          </Button>
          <Box
            sx={{
              textAlign: 'center',
              marginBottom: 2,
            }}
          >
            <Typography variant="subtitle1">
              or
            </Typography>
          </Box>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            onClick={() => navigate('/login')}
          >
            Sign in
          </Button>
          {errorMessage && (
            <Typography sx={{ color: 'red' }}>{errorMessage}</Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default CreateUserPage;
