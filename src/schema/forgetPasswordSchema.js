import * as yup from "yup";
const forgetPasswordSchema = yup.object({
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
});
export { forgetPasswordSchema }