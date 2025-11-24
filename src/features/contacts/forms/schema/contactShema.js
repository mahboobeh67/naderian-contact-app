import * as yup from "yup";

 const contactSchema = yup.object().shape({
  name: yup.string().trim().required("نام الزامی است"),
  phone: yup
    .string()
    .matches(/^09\d{9}$/, "شماره تماس معتبر نیست")
    .required("شماره تماس الزامی است"),
  email: yup
    .string()
    .email("ایمیل معتبر نیست")
    .required("ایمیل الزامی است"),
});
 export {contactSchema}