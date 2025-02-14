import * as yup from "yup";
const resetPasswordSchema = yup.object({
    new_password: yup
        .string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters include at least one uppercase letter, one lowercase letter, one number, and one special character")
        .test(
            "isValidPassword",
            "Password must be at least 8 characters include at least one uppercase letter, one lowercase letter, one number, and one special character",
            value => {
                return (
                    /[A-Z]/.test(value) &&
                    /[a-z]/.test(value) &&
                    /[0-9]/.test(value) &&
                    /[!@#$%^&*(),.?":{}|<>]/.test(value)
                );
            }
        ),
    new_password_confirm: yup
        .string()
        .oneOf([yup.ref("new_password"), null], "Passwords do not match")
        .required("Confirm Password is required"),
});
export { resetPasswordSchema }