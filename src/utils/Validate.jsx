export const checkValidDAta = (name, email, password) => {
  // Email validation
  if (!email) return "Email ID Is Required";
  const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return "Email ID Is Not Valid";

  // Password validation
  if (!password) return "Password Is Required";

  // Detailed password checks
  if (password.length < 8) {
    return "Password Must Be At Least 8 Characters Long";
  }

  // Check for uppercase letter
  if (!/(?=.*[A-Z])/.test(password)) {
    return "Password Must Contain At Least One Capital Letter";
  }

  // Check for lowercase letter
  if (!/(?=.*[a-z])/.test(password)) {
    return "Password Must Contain At Least One Small Letter";
  }

  // Check for number
  if (!/(?=.*\d)/.test(password)) {
    return "Password Must Contain At Least One Number";
  }

  // Check for special character
  if (!/(?=.*[#?!@$%^&*-])/.test(password)) {
    return "Password Must Contain At Least One Special Character";
  }

  // Name validation (only when signing up)
  if (name !== null) {
    if (!name || name.trim() === "") {
      return "Name Is Required";
    }

    if (!/^[A-Za-z\s\-.']+$/.test(name)) {
      return "Name Is Not Valid";
    }

    if (name.length > 15) {
      return "Name Must Be 15 Characters or Less";
    }
  }

  // If all validations pass
  return null;
};
