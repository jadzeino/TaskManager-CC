import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { isValidEmail } from '../utils/helpers';

function LoginPage() {
  const { login } = useUserContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate(); // Use useNavigate hook

  const handleLogin = async () => {
    try {
      // Validate email and password before login
      if (!isValidEmail(email)) {
        setEmailError(true);
        return;
      } else {
        setEmailError(false);
      }

      if (password.length < 6) {
        setPasswordError(true);
        return;
      } else {
        setPasswordError(false);
      }

      await login(email, password)

      // If login is successful, navigate to the dashboard
      navigate('/dashboard');
    } catch (error) {
      // Handle login error
      console.error('Login failed:', error);
      setLoginError('Login failed. Please check your credentials.');
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
          Sign in
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            id={"email-text-field"}
            data-testid={"email-text-field"}
            margin="normal"
            required
            fullWidth
            label="Email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            helperText={emailError ? 'Please enter a valid email address' : ''}
          />
          <TextField
            id={"password-text-field"}
            data-testid={"password-text-field"}
            type="password"
            margin="normal"
            required
            fullWidth
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
            helperText={
              passwordError
                ? 'Password must be at least 6 characters long'
                : ''
            }
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleLogin}
          >
            Sign In
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
            onClick={() => navigate('/create-user')}
          >
            Register
          </Button>
          {loginError && (
            <Typography color="error" variant="subtitle1">
              {loginError}
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;
