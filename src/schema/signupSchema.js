import * as yup from "yup";

const signupSchema = yup.object({
  first_name: yup.string().required("First Name is required").matches(/^[A-Za-z]+$/, "First Name can only contain alphabetic characters"),
  last_name: yup.string().required("Last Name is required").matches(/^[A-Za-z]+$/, "Last Name can only contain alphabetic characters"),
  phone_number: yup.string()
    .required("Mobile Number is required")
    .length(10, "Mobile Number must be exactly 10 digits")
    .matches(/^[0-9]+$/, "Mobile Number must be digits only")
    .test('required-first', null, function (value) {
      if (!value) {
        return this.createError({ message: "Mobile Number is required" });
      }
      return true;
    }),

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
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords do not match")
    .required("Confirm Password is required"),
});
export { signupSchema }