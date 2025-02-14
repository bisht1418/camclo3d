import * as yup from "yup";
const changePasswordSchema = yup.object({
    current_password: yup
        .string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
    password: yup
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
    password_confirmation: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords do not match")
        .required("Confirm Password is required"),
});
export { changePasswordSchema }