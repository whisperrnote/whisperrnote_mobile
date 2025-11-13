export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

export function validateNote(title: string, content: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!title.trim()) {
    errors.push('Title is required');
  }

  if (title.length > 500) {
    errors.push('Title must be less than 500 characters');
  }

  if (content.length > 50000) {
    errors.push('Content must be less than 50000 characters');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
