'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ro' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  ro: {
    // Header
    'nav.features': 'Funcționalități',
    'nav.vendors': 'Furnizori',
    'nav.pricing': 'Prețuri',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.getStarted': 'Începe acum',
    
    // Hero Section
    'hero.title': 'Planifică-ți',
    'hero.titleAccent': 'Ziua Perfectă',
    'hero.subtitle': 'Nunta360 îi ajută pe cuplurile românești să gestioneze fiecare detaliu al nunții lor—de la lista de invitați la rezervarea furnizorilor.',
    'hero.startPlanning': 'Începe Planificarea',
    'hero.exploreFeatures': 'Explorează Funcționalitățile',
    
    // Features Section
    'features.title': 'Tot ce ai nevoie pentru',
    'features.titleAccent': 'nunta perfectă',
    'features.subtitle': 'Organizează fiecare detaliu cu ușurință folosind instrumentele noastre intuitive',
    'features.guestManagement': 'Gestionarea Invitaților',
    'features.guestDescription': 'Gestionează cu ușurință lista de invitați, trimite invitații și urmărește confirmările într-un singur loc.',
    'features.budgetPlanning': 'Planificarea Bugetului',
    'features.budgetDescription': 'Ține evidența cheltuielilor de nuntă cu planificatorul nostru intuitiv de buget. Stabilește limite și monitorizează cheltuielile.',
    'features.vendorDiscovery': 'Descoperirea Furnizorilor',
    'features.vendorDescription': 'Găsește și conectează-te cu furnizori de nuntă de încredere din zona ta. De la fotografi la catering.',
    'features.timelineSync': 'Sincronizarea Programului',
    'features.timelineDescription': 'Coordonează fiecare detaliu cu funcția noastră inteligentă de cronologie. Nu rata niciodată o dată importantă.',
    
    // Showcase Section
    'showcase.title': 'De încredere pentru',
    'showcase.titleAccent': 'sute de cupluri românești',
    'showcase.subtitle': 'Alătură-te miilor de cupluri care și-au planificat nunta perfectă cu Nunta360',
    'showcase.testimonial1': 'Nunta360 ne-a făcut planificarea nunții mult mai ușoară! Am putut urmări totul într-un singur loc.',
    
    // Login Page
    'login.welcome': 'Bine ai revenit la Nunta360',
    'login.title': 'Bine ai venit înapoi',
    'login.subtitle': 'Conectează-te pentru a-ți continua planificarea nunții',
    'login.email': 'Email',
    'login.emailPlaceholder': 'nume@exemplu.com',
    'login.password': 'Parolă',
    'login.passwordPlaceholder': 'Introdu parola',
    'login.rememberMe': 'Ține-mă minte',
    'login.signIn': 'Conectează-te',
    'login.signingIn': 'Se conectează...',
    'login.forgotPassword': 'Ai uitat parola?',
    'login.noAccount': 'Nu ai cont?',
    'login.signUp': 'Înregistrează-te',
    'login.backToHome': 'Înapoi la pagina principală',
    'login.success': 'Conectare reușită',
    'login.welcomeBack': 'Bine ai revenit!',
    'login.error': 'Eroare la conectare',
    
    // Signup Page
    'signup.welcome': 'Bun venit la Nunta360',
    'signup.title': 'Creează un cont nou',
    'signup.subtitle': 'Începe să-ți planifici nunta perfectă astăzi',
    'signup.fullName': 'Nume complet',
    'signup.fullNamePlaceholder': 'Nume și prenume',
    'signup.email': 'Email',
    'signup.emailPlaceholder': 'nume@exemplu.com',
    'signup.password': 'Parolă',
    'signup.passwordPlaceholder': 'Creează o parolă sigură',
    'signup.confirmPassword': 'Confirmă parola',
    'signup.confirmPasswordPlaceholder': 'Introdu din nou parola',
    'signup.createAccount': 'Creează contul',
    'signup.creating': 'Se creează...',
    'signup.alreadyHaveAccount': 'Ai deja cont?',
    'signup.signIn': 'Conectează-te',
    'signup.backToHome': 'Înapoi la pagina principală',
    'signup.termsAgree': 'Accept',
    'signup.terms': 'Termenii și Condițiile',
    'signup.and': 'și',
    'signup.privacy': 'Politica de Confidențialitate',
    'signup.success': 'Cont creat cu succes',
    'signup.checkEmail': 'Verifică-ți email-ul pentru confirmarea contului',
    'signup.error': 'Eroare la crearea contului',
    'signup.passwordMismatch': 'Parolele nu se potrivesc',
    'signup.agreeToTerms': 'Trebuie să accepți termenii și condițiile',
    
    // Dashboard
    'dashboard.welcome': 'Bun venit',
    'dashboard.overview': 'Panou',
    'dashboard.timeline': 'Cronologie',
    'dashboard.guests': 'Invitați',
    'dashboard.venue': 'Locație',
    'dashboard.budget': 'Buget',
    'dashboard.settings': 'Setări',
    'dashboard.weddingDate': 'Data nunții',
    
    // Guest Form
    'guestForm.title': 'Adaugă Invitat',
    'guestForm.subtitle': 'Introdu detaliile invitatului pentru a-l adăuga la listă',
    'guestForm.guestName': 'Nume invitat',
    'guestForm.guestNamePlaceholder': 'Ex: Maria Popescu sau Familia Ionescu',
    'guestForm.phoneNumber': 'Număr de telefon',
    'guestForm.phoneNumberPlaceholder': 'Ex: +40 722 123 456',
    'guestForm.isFamily': 'Vine cu familia',
    'guestForm.familySize': 'Numărul de persoane din familie',
    'guestForm.addGuest': 'Adaugă Invitat',
    'guestForm.cancel': 'Anulează',
    'guestForm.adding': 'Se adaugă...',
    'guestForm.nameRequired': 'Nume necesar',
    'guestForm.enterGuestName': 'Te rog să introduci numele invitatului',
    'guestForm.status': 'Status',
    'guestForm.menuPreference': 'Preferințe meniu',
    
    // Guest Status
    'guest.status.in_asteptare': 'În așteptare',
    'guest.status.confirmat': 'Confirmat',
    'guest.status.refuzat': 'Refuzat',
    
    // Menu Preferences
    'menu.normal': 'Normal',
    'menu.vegetarian': 'Vegetarian',
    'menu.vegan': 'Vegan',
    'menu.fara_gluten': 'Fără gluten',
    'menu.alte_alergii': 'Alte alergii'
  },
  en: {
    // Header
    'nav.features': 'Features',
    'nav.vendors': 'Vendors',
    'nav.pricing': 'Pricing',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.getStarted': 'Get Started',
    
    // Hero Section
    'hero.title': 'Plan Your',
    'hero.titleAccent': 'Perfect Day',
    'hero.subtitle': 'Nunta360 helps Romanian couples manage every detail of their wedding—from guest lists to vendor bookings.',
    'hero.startPlanning': 'Start Planning',
    'hero.exploreFeatures': 'Explore Features',
    
    // Features Section
    'features.title': 'Everything you need for',
    'features.titleAccent': 'the perfect wedding',
    'features.subtitle': 'Organize every detail with ease using our intuitive tools',
    'features.guestManagement': 'Guest Management',
    'features.guestDescription': 'Easily manage your guest list, send invitations and track confirmations in one place.',
    'features.budgetPlanning': 'Budget Planning',
    'features.budgetDescription': 'Keep track of wedding expenses with our intuitive budget planner. Set limits and monitor spending.',
    'features.vendorDiscovery': 'Vendor Discovery',
    'features.vendorDescription': 'Find and connect with trusted wedding vendors in your area. From photographers to catering.',
    'features.timelineSync': 'Timeline Sync',
    'features.timelineDescription': 'Coordinate every detail with our smart timeline feature. Never miss an important date.',
    
    // Showcase Section
    'showcase.title': 'Trusted by',
    'showcase.titleAccent': 'hundreds of Romanian couples',
    'showcase.subtitle': 'Join thousands of couples who planned their perfect wedding with Nunta360',
    'showcase.testimonial1': 'Nunta360 made wedding planning so much easier! We could track everything in one place.',
    
    // Login Page
    'login.welcome': 'Welcome back to Nunta360',
    'login.title': 'Welcome back',
    'login.subtitle': 'Sign in to continue planning your perfect wedding',
    'login.email': 'Email',
    'login.emailPlaceholder': 'name@example.com',
    'login.password': 'Password',
    'login.passwordPlaceholder': 'Enter your password',
    'login.rememberMe': 'Remember me',
    'login.signIn': 'Sign In',
    'login.signingIn': 'Signing in...',
    'login.forgotPassword': 'Forgot password?',
    'login.noAccount': "Don't have an account?",
    'login.signUp': 'Sign Up',
    'login.backToHome': 'Back to home',
    'login.success': 'Sign in successful',
    'login.welcomeBack': 'Welcome back!',
    'login.error': 'Sign in error',
    
    // Signup Page
    'signup.welcome': 'Welcome to Nunta360',
    'signup.title': 'Create a new account',
    'signup.subtitle': 'Start planning your perfect wedding today',
    'signup.fullName': 'Full Name',
    'signup.fullNamePlaceholder': 'First and last name',
    'signup.email': 'Email',
    'signup.emailPlaceholder': 'name@example.com',
    'signup.password': 'Password',
    'signup.passwordPlaceholder': 'Create a secure password',
    'signup.confirmPassword': 'Confirm Password',
    'signup.confirmPasswordPlaceholder': 'Enter password again',
    'signup.createAccount': 'Create Account',
    'signup.creating': 'Creating...',
    'signup.alreadyHaveAccount': 'Already have an account?',
    'signup.signIn': 'Sign In',
    'signup.backToHome': 'Back to home',
    'signup.termsAgree': 'I agree to the',
    'signup.terms': 'Terms and Conditions',
    'signup.and': 'and',
    'signup.privacy': 'Privacy Policy',
    'signup.success': 'Account created successfully',
    'signup.checkEmail': 'Check your email to confirm your account',
    'signup.error': 'Account creation error',
    'signup.passwordMismatch': 'Passwords do not match',
    'signup.agreeToTerms': 'You must agree to the terms and conditions',
    
    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.overview': 'Dashboard',
    'dashboard.timeline': 'Timeline',
    'dashboard.guests': 'Guests',
    'dashboard.venue': 'Venue',
    'dashboard.budget': 'Budget',
    'dashboard.settings': 'Settings',
    'dashboard.weddingDate': 'Wedding date',
    
    // Guest Form
    'guestForm.title': 'Add Guest',
    'guestForm.subtitle': 'Enter guest details to add them to your list',
    'guestForm.guestName': 'Guest name',
    'guestForm.guestNamePlaceholder': 'Ex: Maria Popescu or The Ionescu Family',
    'guestForm.phoneNumber': 'Phone number',
    'guestForm.phoneNumberPlaceholder': 'Ex: +40 722 123 456',
    'guestForm.isFamily': 'Coming with family',
    'guestForm.familySize': 'Number of family members',
    'guestForm.addGuest': 'Add Guest',
    'guestForm.cancel': 'Cancel',
    'guestForm.adding': 'Adding...',
    'guestForm.nameRequired': 'Name required',
    'guestForm.enterGuestName': 'Please enter the guest name',
    'guestForm.status': 'Status',
    'guestForm.menuPreference': 'Menu preference',
    
    // Guest Status
    'guest.status.in_asteptare': 'Pending',
    'guest.status.confirmat': 'Confirmed',
    'guest.status.refuzat': 'Declined',
    
    // Menu Preferences
    'menu.normal': 'Normal',
    'menu.vegetarian': 'Vegetarian',
    'menu.vegan': 'Vegan',
    'menu.fara_gluten': 'Gluten-free',
    'menu.alte_alergii': 'Other allergies'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('ro');

  const t = (key: string): string => {
    return (translations[language] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};