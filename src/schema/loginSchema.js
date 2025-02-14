import * as yup from "yup";
const loginSchema = yup.object({
    email: yup.string()
        .required("Email is required")
        .email("Invalid email address"),
    password: yup
        .string()
        .required("Password is required")
});
export { loginSchema }