// Reusable validation helpers for user app
// Keep in sync with frontend validators when possible

export const validateRequired = (value, fieldName) => {
  if (!value || value.toString().trim() === '') {
    return `${fieldName} is required`
  }
  return null
}

export const validateEmail = (value) => {
  if (!value) return null
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    return 'Please enter a valid email address'
  }
  return null
}

export const validatePhone = (value) => {
  if (!value) return null
  const phoneRegex = /^[0-9]{10}$/
  if (!phoneRegex.test(value)) {
    return 'Phone number must be exactly 10 digits'
  }
  return null
}

export const validateMinLength = (value, minLength, fieldName) => {
  if (!value) return null
  if (value.toString().trim().length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`
  }
  return null
}

export const validateMaxLength = (value, maxLength, fieldName) => {
  if (!value) return null
  if (value.toString().trim().length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`
  }
  return null
}

export const validatePasswordDigits = (value) => {
  if (!value) return null
  const digitsRegex = /^[0-9]{8}$/
  if (!digitsRegex.test(value)) {
    return 'Password must be exactly 8 digits'
  }
  return null
}

export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) return null
  if (password !== confirmPassword) {
    return 'Passwords do not match'
  }
  return null
}
