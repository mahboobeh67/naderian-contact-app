# 📇 Contact App Created by Mahboobeh Naderian ❤️

A modern **Contact Management App** built with [React + Vite] and architected using a **Flux (Model B2)** architecture.

---

## ✨ Features

🧠 State management with **Context + Reducer** (Flux B2)

💾 Auto‑sync of contacts with `localStorage`

⚙️ Modular and **reusable form components**

✅ Form validation with **Yup**

🪄 Form management with **React Hook Form**

🚀 Optimized imports with custom `relink‑imports.js`

🔍 Pre‑configured with ESLint and Prettier

---

## 🧩 Project Structure

```text

src/

 ├── features/

 │   └── contacts/

 │       ├── actions/           # Flux actions (create, update, delete…)

 │       ├── context/           # Context, reducer, actionTypes

 │       ├── components/        # Reusable UI + Form Components

 │       └── utils/             # reusable helpers

 └── scripts/

     └── relink-imports-advanced.js


## 🧰 Installation & Setup

```bash

# Clone repository

git clone https://github.com/mahboobeh67/contact-app.git

cd contact-app

# Install dependencies

npm install

# Run development server

npm run dev


## 🧱 Tech Stack

| Library | Use |

|----------|-----|

| React 18 + Vite | SPA environment |

| Context API + Reducer | Flux Flow structure |

| React Hook Form | Form control engine |

| Yup | Validation Schema Builder |

| ESLint + Prettier | Code standards & formatting |

| localStorage | Persistent caching |

---

## 🧞‍♀️ Reusable Form Components

All form inputs share a unified API for easy reuse:

```jsx
<FieldInput
  name="email"
  label="آدرس ایمیل"
  control={form.control}
  validation={yup.string().email("ایمیل اشتباه وارد شد").required("الزامی")}
  placeholder="example@gmail.com"
/>
```

## ⚙️ Example: Validation Schema with Yup

```js
import * as yup from "yup";

export const contactSchema = yup.object().shape({
  name: yup.string().required("نام الزامی است"),
  phone: yup
    .string()
    .matches(/^[0-9]{11}$/, "شماره باید ۱۱ رقم باشد")
    .required("شماره تلفن الزامی است"),
  email: yup.string().email("فرمت ایمیل نادرست است"),
});
```

### Hook Integration

```jsx
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

const form = useForm({ resolver: yupResolver(contactSchema) });
```

## 🧠 Developer Notes

 Each action follows **B2 Injection Model**: `(dispatch, getState) => async (args) => {...}`

 State is **immutable** and **pure**, managed via reducer.

 `ContactsContext.jsx` acts as **Dependency Injection Container** for actions and store.

  
## 🩵 Author

**Mahboobeh Naderian**
📍 Yasuj, Iran
 🌐 [GitHub: @mahboobeh67](https://github.com/mahboobeh67)
 🧩 _Micro‑DI Mind | Flux‑Fueled Heart_

 🪩 _Built with love, logic, and a bit of Vite magic ✨_

# 📇 Contact App Created by Mahboobeh Naderian ❤️

A modern **Contact Management App** built with [React + Vite] and architected using a **Flux (Model B2)** architecture. This document provides a comprehensive overview of the application's structure, ...

## ✨ Features Deep Dive

The application emphasizes robust state management, developer experience (DX), and data persistence.

### 🧠 State Management: Context + Reducer (Flux B2 Model)

The core of the application's state control adheres to the Flux B2 pattern, which enhances predictability and testability:

1.  **Store (State):** The single source of truth, holding the array of contacts and any application loading/error states.

2.  **Actions:** Plain JavaScript objects describing _what_ happened (e.g., `ADD_CONTACT`, `SET_CONTACTS`).

3.  **Dispatcher (Implicitly via `useReducer`):** The central hub that receives actions and passes them to the Reducer.

4.  **Reducer:** A pure function that calculates the next state based on the current state and the received action.

5.  **Views (Components):** Components consume the state via `useContext` and dispatch actions in response to user input.

This pattern ensures that state updates flow in one direction, making debugging significantly easier than in traditional MVC setups.

### 💾 Auto‑sync of Contacts with `localStorage`

To ensure data persistence across sessions without relying on a backend server during development, all contact manipulations (add, edit, delete) trigger an automatic update to the browser's `localStor...

- **Mechanism:** A side effect listener (often within the main context provider or an effect hook triggered by state change) serializes the current state (`JSON.stringify`) and saves it under a spec...

- **Initialization:** On application load, the reducer checks `localStorage` first. If data exists, it initializes the state from there; otherwise, it starts with an empty array.

### ⚙️ Modular and Reusable Form Components

To maintain consistency and reduce boilerplate, form elements are abstracted into highly reusable components (`FieldInput`, `FieldSelect`, etc.). These components decouple presentation from logic:

- They rely entirely on props (`control`, `name`, `validation`) passed down from `React Hook Form`.

- This separation allows the main feature components (like `ContactForm`) to focus solely on _what_ data is needed, not _how_ it is rendered or validated.

### ✅ Form Validation with Yup

**Yup** is used to define declarative, schema-based validation rules.

- **Declarative Schema:** Validation logic is defined once in a separate schema file (e.g., `contactSchema.js`).

- **Integration:** This schema is passed directly to `react-hook-form` via the `yupResolver`.

### 🪄 Form Management with React Hook Form

`React Hook Form` is selected for its performance benefits. It achieves minimal re-renders by avoiding reliance on component state for tracking field values.

- **Uncontrolled Components:** It primarily manages input state internally.

- **Performance:** It uses references instead of state updates for field values, leading to faster form handling, especially in complex forms.

### 🚀 Optimized Imports with Custom `relink‑imports.js`

To combat the complexity introduced by deeply nested module structures (especially common in feature-sliced design), a custom script is employed:

- **Purpose:** The `relink-imports.js` script (or its advanced variant) scans the project for absolute or complex relative imports and rewrites them to use standardized, relative paths or establishe...

### 🔍 Pre‑configured with ESLint and Prettier

Strict coding standards are enforced from the start:

- **ESLint:** Catches potential bugs and enforces best practices (e.g., React Hooks rules, complexity limits).

- **Prettier:** Ensures automatic, consistent code formatting across all files upon saving or committing.

## 🧩 Project Structure

The architecture follows a clear separation of concerns, heavily favoring feature-centric organization over traditional type-centric separation (like having one massive `components` folder).

```text

src/

├── features/

│   └── contacts/           # Self-contained feature module

│       ├── actions/        # Functions that dispatch to the reducer (e.g., saveContact, loadContacts)

│       ├── context/        # Central provider: Contains Context, Reducer, Initial State, and Context Provider component.

│       ├── components/     # UI components specific to contacts (ContactList, ContactForm)

│       └── utils/          # Reusable helpers specific to contact logic (e.g., API wrappers, formatters)

└── scripts/


└── relink-imports-advanced.js  # Build/setup utility script


---

## 🧰 Installation & Setup

Follow these steps to get the development environment running:

```bash

# 1. Clone repository

git clone https://github.com/mahboobeh67/contact-app.git

cd contact-app

# 2. Install dependencies

# This fetches React, Vite, RHF, Yup, and dev dependencies defined in package.json

npm install

# 3. Run development server

# Starts Vite's HMR server, usually accessible at http://localhost:5173 (port may vary)


npm run dev


## 🧱 Tech Stack Summary

| Library | Use | Rationale |

| :--- | :--- | :--- |

| React 18 + Vite | SPA environment | Modern React features (Hooks, Suspense) paired with Vite's blazing fast build times. |

| Context API + Reducer | Flux Flow structure | Efficient, global state management without requiring external libraries for simple needs. |

| React Hook Form | Form control engine | Superior performance via uncontrolled inputs and minimal re-renders. |

| Yup | Validation Schema Builder | Declarative, robust, and easily composable validation schemas. |

| ESLint + Prettier | Code standards & formatting | Ensures high code quality and aesthetic consistency across the entire codebase. |

| localStorage | Persistent caching | Simple, client-side persistence for demonstration or offline readiness. |

## 🧞‍♀️ Reusable Form Components API

The standardized component API ensures consistency regardless of the input type (text, number, select).

Every form field component consumes the configuration from `React Hook Form`'s `control` object:

```jsx
<FieldInput
  name="email" // Required: Must match a key in the Yup schema
  label="آدرس ایمیل" // Display label
  control={form.control} // Required: The form control object from useForm()
  validation={yup.string().email("ایمیل اشتباه وارد شد").required("الزامی")} // Optional inline schema override/addition
  placeholder="example@gmail.com"
/>
```

The implementation of `FieldInput` handles subscribing to changes, displaying errors, and rendering the native input element internally.

## ⚙️ Example: Validation Schema with Yup

Validation logic is centralized and strongly typed against the expected data structure.

### Defining the Schema (`contactSchema.js`)

```js
import * as yup from "yup";

// Note: This schema uses Persian characters for error messages, aligning with the application's likely locale.

export const contactSchema = yup.object().shape({
  name: yup.string().required("نام الزامی است"),

  phone: yup

    .string()

    // Ensures exactly 11 digits (common Iranian mobile format)

    .matches(/^[0-9]{11}$/, "شماره باید ۱۱ رقم باشد")

    .required("شماره تلفن الزامی است"),

  email: yup.string().email("فرمت ایمیل نادرست است"), // Email validation
});
```

### Hook Integration (`ContactForm.jsx`)

The `useForm` hook ties the schema definition to the form lifecycle:

```jsx
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import { contactSchema } from "./contactSchema";

// ... inside the component body

const form = useForm({
  resolver: yupResolver(contactSchema), // Injects the validation logic

  defaultValues: {
    name: "",

    phone: "",

    email: "",
  },
});

// The 'form' object is then passed down to FieldInput components via the 'control' prop.
```

## 🧠 Developer Notes on Flux B2

The architecture choice dictates specific coding patterns for developers working on the system:

### Action Injection Model

Actions are designed to be asynchronous-capable and receive the necessary dispatch context:

- **Signature:** Each action creator (or "Thunk" style action) adheres to the signature: `(dispatch, getState) => async (args) => { ... }`.

- **Benefit:** This allows actions to read the current state (`getState()`) before dispatching subsequent actions, enabling complex workflows like "fetch data, check if data exists, if not, dispatch...

### State Immutability and Purity

1.  **Purity:** The Reducer _must_ be a pure function. Given the same state and action, it must always return the exact same next state. It should contain **no side effects** (no API calls, no `localS...

2.  **Immutability:** State objects and arrays must never be mutated directly. Updates require creating new object references:

- **Correct Update:** `return { ...state, contacts: [...state.contacts, newContact] };`

- **Incorrect (Mutation):** `state.contacts.push(newContact); return state;`

### Dependency Injection Container (`ContactsContext.jsx`)

The primary Context file serves as the central hub:

1.  It initializes the `useReducer` hook, yielding `state` and `dispatch`.
    

2.  It wraps the action creators with the `dispatch` function, creating specialized, curried action handlers (e.g., `boundAddContact = (args) => dispatch(actions.add(args))`).
    

3.  It provides both the raw `state` and the **bound action handlers** via the Context Provider value. This pattern ensures that child components only receive the _specific_ actions they need to trigg...
  



## 🩵 Author

**Mahboobeh Naderian**

 📍 Yasuj, Iran

 🌐 [GitHub: @mahboobeh67](https://github.com/mahboobeh67)
 🧩 _Micro‑DI Mind | Flux‑Fueled Heart_

 🪩 _Built with love, logic, and a bit of Vite magic ✨_

autorenew

thumb_up

thumb_down
