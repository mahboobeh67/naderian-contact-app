/* cSpell: disable */
import * as yup from "yup";

export const contactSchema = yup.object().shape({
  firstName: yup.string().required("نام الزامی است"),
  lastName: yup.string().required("نام خانوادگی الزامی است"),
  phone: yup
    .string()
    .matches(/^09\d{9}$/, "شماره باید با 09 شروع شده و ۱۱ رقم باشد")
    .required("شماره الزامی است"),
  email: yup
    .string()
    .email("ایمیل معتبر نیست")
    .required("ایمیل الزامی است"),
});