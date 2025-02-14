import * as yup from "yup";
const profileSchema = yup.object({
  first_name: yup.string().required("First Name is required").matches(/^[A-Za-z]+$/, "First Name can only contain alphabetic characters"),
  last_name: yup.string().required("Last Name is required").matches(/^[A-Za-z]+$/, "Last Name can only contain alphabetic characters"),
  mobile_no: yup.string()
    .required("Mobile Number is required")
    .length(10, "Phone Number must be exactly 10 digits")
    .matches(/^[0-9]+$/, "Phone Number must be digits only")
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

});

export { profileSchema }