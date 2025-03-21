// export const checkValidDAta = (name, email, password) => {
//   const isEmailValid = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(
//     email
//   );

//   const isPasswordValid =
//     /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
//       password
//     );

//   if (name !== null) {
//     if (name.trim() === "") return "Name Is Required";
//     if (!/^[A-Za-z\s\-.']+$/.test(name)) return "Name Is Not Valid";
//   }

//   if (!isEmailValid) return "Email ID Is Not Valid";
//   if (!isPasswordValid) return "Password Is Not Valid";

//   return null;
// };
export const checkValidDAta = (name, email, password) => {
  const isEmailValid = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(
    email
  );

  const isPasswordValid =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
      password
    );
  if (name) {
    if (name.trim() === "") return "Name Is Required";
    if (!/^[A-Za-z\s\-.']+$/.test(name)) return "Name Is Not Valid";
  }

  if (!isEmailValid) return "Email ID Is Not Valid";
  if (!isPasswordValid) return "Password Is Not Valid";

  return null;
};
