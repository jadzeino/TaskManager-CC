export function isValidateTaskStatusTransition(currentStatus: string, newStatus: string) {
    const allowedTransitions: { [key: string]: string[] } = {
      ToDo: ['InProgress'],
      InProgress: ['Blocked', 'InQA'],
      Blocked: ['ToDo'],
      InQA: ['ToDo', 'Done'],
      Done: ['Deployed'],
    };

    if (!allowedTransitions[currentStatus]) {
        console.log("wont work ",currentStatus,"  ",newStatus)
      return false
    }
  
    if (!allowedTransitions[currentStatus].includes(newStatus)) {
        console.log("also wont work ",currentStatus,"  ",newStatus)
      return false
    }
    return true
  }

    // Function to validate email format
    export const isValidEmail = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      };
    
    // Function to validate password
    // Password should be at least 8 characters in length and contain at least 1 number, 1 alphabetical character, and 1 special character
    export const isPasswordValid = (value: string) => {
        let errorMessage = '';
        
        if (value.length < 8) {
          errorMessage += 'Must be at least 8 characters long\n';
        }
        if (!/\d/.test(value)) {
          errorMessage += 'Must contain at least 1 number\n';
        }
        if (!/[a-zA-Z]/.test(value)) {
            errorMessage += 'Must contain at least 1 alphabetical character\n';
          }
        if (!/[@#$%^&+=!]/.test(value)) {
          errorMessage += 'Must contain at least 1 special character\n';
        }
      
        return errorMessage;
      };