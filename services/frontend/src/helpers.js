export const path = "http://127.0.0.1:8000";

export const validatePassword = (password, confirmationPassword) => {
    if (password !== confirmationPassword) {
        return "Password and confirmation password must match";
    }
    if (password.length < 8) {
        return "Password must be at least 8 characters long";
    }
    return null;
};

