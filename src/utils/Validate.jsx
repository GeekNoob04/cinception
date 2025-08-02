export const checkValidDAta = (name, email, password) => {
    console.log("✅ Latest validation running");
    // Email validation
    if (!email) return "Email ID Is Required";
    const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return "Email ID Is Not Valid";

    // Password validation
    if (!password) return "Password Is Required";
    if (password.length < 8) {
        return "Password Must Be At Least 8 Characters Long";
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

    return null; // All good
};
