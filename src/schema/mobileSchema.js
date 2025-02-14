import * as yup from "yup";
const mobileSchema = yup.object({
  phone_number: yup.string()
  .required("Mobile Number is required")
  .length(10, "Phone Number must be exactly 10 digits")
  .matches(/^[0-9]+$/, "Phone Number must be digits only")
  .test('required-first', null, function (value) {
    if (!value) {
      return this.createError({ message: "Mobile Number is required" });
    }
    return true;
  }),
 
  });
  export {mobileSchema}