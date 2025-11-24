// src/features/contacts/ContactForm.jsx
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {contactSchema} from "../forms/schema/contactShema.js"  
import InputField from "./InputFiled.jsx";  // مسیر واحد و درست
import AddButton from "../../../shared/ui/AddButton.jsx";              // دکمه‌ی هماهنگ با پروژه
import styles from "./ContactForm.module.css";

function ContactForm({ onValid, bulkDeleteHandler, selectedIds }) {
  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      age: "",
    },
  });

  const { handleSubmit, reset } = methods;

  const handleValid = (data) => {
    onValid(data);
    reset();
  };

  return (
    <FormProvider {...methods}>
      <form className={styles.form} onSubmit={handleSubmit(handleValid)}>
        <div className={styles.row}>
          <InputField name="firstName" label="نام" placeholder="مثلاً محبوبه" />
          <InputField name="lastName" label="نام خانوادگی" placeholder="مثلاً نادری" />
        </div>

        <div className={styles.row}>
          <InputField name="email" type="email" label="ایمیل" placeholder="example@mail.com" />
          <InputField name="phone" label="شماره تلفن" placeholder="0912..." />
        </div>

        <div className={styles.row}>
          <InputField name="age" type="number" label="سن" placeholder="سن بر اساس سال" />
        </div>

        <div className={styles.actions}>
          <AddButton type="submit">ذخیره مخاطب</AddButton>
          <AddButton type="button" variant="danger" onClick={bulkDeleteHandler}>
            حذف انتخاب‌شده‌ها ({selectedIds?.length || 0})
          </AddButton>
        </div>
      </form>
    </FormProvider>
  );
}
export default ContactForm