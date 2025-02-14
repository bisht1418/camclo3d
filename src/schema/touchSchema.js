import * as yup from "yup";

const touchSchema = yup.object({
    name: yup
        .string()
        .required("Name is required")
        .matches(/^[A-Za-z\s]+$/, "Name can only contain alphabetic characters and spaces"),
    email: yup
        .string()
        .required("Email is required")
        .email("Email must not start with a capital letter and must contain a valid domain (e.g., .com, .in)")
        .matches(
            /^[a-z][a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Email must not start with a capital letter and must contain a valid domain (e.g., .com, .in)"
        )
        .test("required-email", "Email is required", function (value) {
            if (!value) {
                return this.createError({ message: "Email is required" });
            }
            return true;
        }),
    message: yup.string()
});

export { touchSchema }