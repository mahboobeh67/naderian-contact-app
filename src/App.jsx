import { ContactsProvider } from "@/features/contacts";
import ContactList from "@/features/contacts/components/ContactList";
import ContactForm from "@/features/contacts/components/ContactForm";
import { Header } from "@/shared/ui";





const App = () => {
  return (
    <ContactsProvider>
      <Header />
      <main style={{ padding: "1rem" }}>
        <ContactForm />
        <ContactList />
      </main>
    </ContactsProvider>
  );
};

export default App;

