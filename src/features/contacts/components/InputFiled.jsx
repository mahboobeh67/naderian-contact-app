import { useFormContext } from "react-hook-form";

export function InputField({ name, label, type = "text", placeholder }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={errors[name] ? "error-input" : ""}
      />
      {errors[name] && (
        <small className="error-text">{errors[name]?.message}</small>
      )}
    </div>
  );
}

export default InputField