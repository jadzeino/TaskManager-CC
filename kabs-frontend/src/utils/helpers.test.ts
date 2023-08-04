import { isValidateTaskStatusTransition, isValidEmail, isPasswordValid } from './helpers';

describe('Helper Functions Tests', () => {
  describe('isValidateTaskStatusTransition', () => {
    it('should return true for valid transitions', () => {
      expect(isValidateTaskStatusTransition('ToDo', 'InProgress')).toBe(true);
      expect(isValidateTaskStatusTransition('InProgress', 'InQA')).toBe(true);
      expect(isValidateTaskStatusTransition('InQA', 'ToDo')).toBe(true);
    });

    it('should return false for invalid transitions', () => {
      expect(isValidateTaskStatusTransition('ToDo', 'Blocked')).toBe(false);
      expect(isValidateTaskStatusTransition('Blocked', 'Deployed')).toBe(false);
      expect(isValidateTaskStatusTransition('InQA', 'Blocked')).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user1234@test.co')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(isValidEmail('invalidemail@')).toBe(false);
      expect(isValidEmail('email@.com')).toBe(false);
      expect(isValidEmail('test@example')).toBe(false);
    });
  });

  describe('isPasswordValid', () => {
    it('should return an empty string for a valid password', () => {
      expect(isPasswordValid('StrongP@ssw0rd')).toBe('');
    });

    it('should return the error message for an invalid password', () => {
      expect(isPasswordValid('short')).toContain('Must be at least 8 characters long');
      expect(isPasswordValid('short!!!!!')).toContain('Must contain at least 1 number');
      expect(isPasswordValid('123@')).toContain('Must contain at least 1 alphabetical character');
      expect(isPasswordValid('weakpassword')).toContain('Must contain at least 1 special character');
    });
  });
});
