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
    'features.vendorDiscovery': 'Descoperirea Furnizorilor',
    'features.vendorDescription': 'Găsește și conectează-te cu furnizori de nuntă de încredere din zona ta. De la fotografi la catering, descoperă echipa perfectă pentru ziua ta specială.',
    'features.budgetPlanning': 'Planificarea Bugetului',
    'features.budgetDescription': 'Ține evidența cheltuielilor de nuntă cu planificatorul nostru intuitiv de buget. Stabilește limite, monitorizează cheltuielile și rămâi pe drumul cel bun financiar.',
    'features.guestManagement': 'Gestionarea Invitaților',
    'features.guestDescription': 'Gestionează cu ușurință lista de invitați, trimite invitații și urmărește confirmările într-un singur loc. Fă aranjamentele pentru locuri o plăcere.',
    'features.timelineSync': 'Sincronizarea Programului',
    'features.timelineDescription': 'Coordonează fiecare detaliu cu funcția noastră inteligentă de cronologie. Sincronizează cu calendarul tău și nu rata niciodată o dată importantă.',
    
    // Showcase Section
    'showcase.title': 'De încredere pentru',
    'showcase.titleAccent': 'sute de cupluri românești',
    'showcase.subtitle': 'Alătură-te miilor de cupluri care și-au planificat nunta perfectă cu Nunta360',
    'showcase.testimonial1': 'Nunta360 ne-a făcut planificarea nunții mult mai ușoară! Am putut urmări totul într-un singur loc.',
    'showcase.testimonial2': 'Funcția de descoperire a furnizorilor ne-a ajutat să găsim profesioniști locali minunați. Foarte recomandat!',
    'showcase.testimonial3': 'Planificarea bugetului a fost foarte ușoară cu această aplicație. Am rămas în limitele bugetului și am avut nunta de vis.',
    'showcase.stats.couples': 'Cupluri Fericite',
    'showcase.stats.vendors': 'Furnizori',
    'showcase.stats.cities': 'Orașe',
    'showcase.stats.satisfaction': 'Satisfacție',
    
    // Product Preview
    'product.title': 'Planifică, Personalizează, Sărbătorește',
    'product.titleAccent': 'Totul într-o singură aplicație',
    'product.subtitle': 'Aruncă o privire asupra modului în care Nunta360 simplifică fiecare aspect al călătoriei tale de planificare a nunții',
    'product.guestList': 'Manager Listă Invitați',
    'product.budgetTracker': 'Urmăritor Buget',
    'product.vendorDirectory': 'Director Furnizori',
    'product.timelinePlanner': 'Planificator Timeline',
    'product.feature1.title': 'Gestionare Inteligentă a Invitaților',
    'product.feature1.description': 'Organizează lista de invitați, urmărește confirmările și gestionează cerințele dietetice într-o interfață intuitivă.',
    'product.feature2.title': 'Planificare Inteligentă a Bugetului',
    'product.feature2.description': 'Stabilește bugete, urmărește cheltuielile și primește informații pentru a lua decizii în cunoștință de cauză.',
    'product.feature3.title': 'Rețea Curată de Furnizori',
    'product.feature3.description': 'Accesează rețeaua noastră verificată de profesioniști în nunți din România și citește recenzii autentice.',
    
    // CTA Banner
    'cta.title': 'Gata să începi',
    'cta.titleAccent': 'călătoria împreună?',
    'cta.subtitle': 'Alătură-te miilor de cupluri care și-au planificat nunta perfectă cu Nunta360',
    'cta.createAccount': 'Creează Contul Gratuit',
    'cta.trial': 'Nu necesită card de credit • Încercare gratuită de 14 zile • Anulare oricând',
    
    // Footer
    'footer.tagline': 'Platforma completă de planificare a nunții pentru cuplurile românești moderne.',
    'footer.product': 'Produs',
    'footer.support': 'Suport',
    'footer.legal': 'Legal',
    'footer.helpCenter': 'Centru de Ajutor',
    'footer.contactUs': 'Contactează-ne',
    'footer.weddingGuide': 'Ghid de Nuntă',
    'footer.privacyPolicy': 'Politica de Confidențialitate',
    'footer.termsOfService': 'Termenii de Serviciu',
    'footer.cookiePolicy': 'Politica Cookie',
    'footer.copyright': '© 2024 Nunta360. Toate drepturile rezervate. Făcut cu ❤️ în România.',
    
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
    'login.forgotPassword': 'Ai uitat parola?',
    'login.noAccount': 'Nu ai cont?',
    'login.signUp': 'Înregistrează-te',
    'login.orContinueWith': 'Sau continuă cu',
    'login.google': 'Google',
    'login.facebook': 'Facebook',
    'login.backToHome': 'Înapoi la pagina principală',
    // Signup Page
    'signup.welcome': 'Bun venit la Nunta360',
    'signup.title': 'Creează-ți contul',
    'signup.subtitle': 'Începe să-ți planifici nunta de vis',
    'signup.fullName': 'Nume complet',
    'signup.fullNamePlaceholder': 'Numele și prenumele',
    'signup.email': 'Email',
    'signup.emailPlaceholder': 'nume@exemplu.com',
    'signup.password': 'Parolă',
    'signup.passwordPlaceholder': 'Minim 8 caractere',
    'signup.confirmPassword': 'Confirmă parola',
    'signup.confirmPasswordPlaceholder': 'Introdu parola din nou',
    'signup.termsAgree': 'Sunt de acord cu',
    'signup.terms': 'Termenii și Condițiile',
    'signup.and': 'și',
    'signup.privacy': 'Politica de Confidențialitate',
    'signup.createAccount': 'Creează Cont',
    'signup.alreadyHaveAccount': 'Ai deja un cont?',
    'signup.signIn': 'Conectează-te',
    'signup.orContinueWith': 'Sau continuă cu',
    'signup.backToHome': 'Înapoi la pagina principală',
    // Dashboard
    'dashboard.overview': 'Prezentare Generală',
    'dashboard.timeline': 'Calendar',
    'dashboard.guests': 'Invitați',
    'dashboard.budget': 'Buget',
    'dashboard.settings': 'Setări',
    'dashboard.logout': 'Deconectare',
    'dashboard.notifications': 'Notificări',
    'dashboard.daysLeft': 'Zile Rămase',
    'dashboard.guestList': 'Lista Invitați',
    'dashboard.budgetUsed': 'Buget Folosit',
    'dashboard.tasksDone': 'Sarcini Finalizate',
    'dashboard.planningProgress': 'Progres Planificare',
    'dashboard.upcomingTasks': 'Sarcini Următoare',
    'dashboard.venue': 'Locație & Catering',
    'dashboard.decorations': 'Decorațiuni',
    'dashboard.music': 'Muzică & Entertainment',
    'dashboard.weddingDate': 'Data Nunții',
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
    'features.title': 'Everything you need for your',
    'features.titleAccent': 'perfect wedding',
    'features.subtitle': 'Organize every detail with ease using our intuitive tools',
    'features.vendorDiscovery': 'Vendor Discovery',
    'features.vendorDescription': 'Find and connect with trusted Romanian wedding vendors in your area. From photographers to caterers, discover the perfect team for your special day.',
    'features.budgetPlanning': 'Budget Planning',
    'features.budgetDescription': 'Keep track of your wedding expenses with our intuitive budget planner. Set limits, monitor spending, and stay on track financially.',
    'features.guestManagement': 'Guest Management',
    'features.guestDescription': 'Easily manage your guest list, send invitations, and track RSVPs all in one place. Make seating arrangements a breeze.',
    'features.timelineSync': 'Timeline Sync',
    'features.timelineDescription': 'Coordinate every detail with our smart timeline feature. Sync with your calendar and never miss an important deadline.',
    
    // Showcase Section
    'showcase.title': 'Trusted by hundreds of',
    'showcase.titleAccent': 'Romanian couples',
    'showcase.subtitle': 'Join thousands of couples who planned their perfect wedding with Nunta360',
    'showcase.testimonial1': 'Nunta360 made our wedding planning so much easier! We could track everything in one place.',
    'showcase.testimonial2': 'The vendor discovery feature helped us find amazing local professionals. Highly recommended!',
    'showcase.testimonial3': 'Budget planning was a breeze with this app. We stayed within our budget and had our dream wedding.',
    'showcase.stats.couples': 'Happy Couples',
    'showcase.stats.vendors': 'Vendors',
    'showcase.stats.cities': 'Cities',
    'showcase.stats.satisfaction': 'Satisfaction',
    
    // Product Preview
    'product.title': 'Plan, Customize, Celebrate',
    'product.titleAccent': 'All in One App',
    'product.subtitle': 'Get a glimpse of how Nunta360 simplifies every aspect of your wedding planning journey',
    'product.guestList': 'Guest List Manager',
    'product.budgetTracker': 'Budget Tracker',
    'product.vendorDirectory': 'Vendor Directory',
    'product.timelinePlanner': 'Timeline Planner',
    'product.feature1.title': 'Smart Guest Management',
    'product.feature1.description': 'Organize your guest list, track RSVPs, and manage dietary requirements all in one intuitive interface.',
    'product.feature2.title': 'Intelligent Budget Planning',
    'product.feature2.description': 'Set budgets, track expenses, and get insights to help you make informed decisions about your wedding spending.',
    'product.feature3.title': 'Curated Vendor Network',
    'product.feature3.description': 'Access our vetted network of Romanian wedding professionals and read authentic reviews from other couples.',
    
    // CTA Banner
    'cta.title': 'Ready to start your',
    'cta.titleAccent': 'journey together?',
    'cta.subtitle': 'Join thousands of couples who planned their perfect wedding with Nunta360',
    'cta.createAccount': 'Create Your Free Account',
    'cta.trial': 'No credit card required • 14-day free trial • Cancel anytime',
    
    // Footer
    'footer.tagline': 'The complete wedding planning platform for modern Romanian couples.',
    'footer.product': 'Product',
    'footer.support': 'Support',
    'footer.legal': 'Legal',
    'footer.helpCenter': 'Help Center',
    'footer.contactUs': 'Contact Us',
    'footer.weddingGuide': 'Wedding Guide',
    'footer.privacyPolicy': 'Privacy Policy',
    'footer.termsOfService': 'Terms of Service',
    'footer.cookiePolicy': 'Cookie Policy',
    'footer.copyright': '© 2024 Nunta360. All rights reserved.',
    
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
    'login.forgotPassword': 'Forgot password?',
    'login.noAccount': "Don't have an account?",
    'login.signUp': 'Sign up',
    'login.orContinueWith': 'Or continue with',
    'login.google': 'Google',
    'login.facebook': 'Facebook',
    'login.backToHome': 'Back to home',
    // Signup Page
    'signup.welcome': 'Welcome to Nunta360',
    'signup.title': 'Create your account',
    'signup.subtitle': 'Start planning your dream wedding',
    'signup.fullName': 'Full name',
    'signup.fullNamePlaceholder': 'First and last name',
    'signup.email': 'Email',
    'signup.emailPlaceholder': 'name@example.com',
    'signup.password': 'Password',
    'signup.passwordPlaceholder': 'Minimum 8 characters',
    'signup.confirmPassword': 'Confirm password',
    'signup.confirmPasswordPlaceholder': 'Enter password again',
    'signup.termsAgree': 'I agree to the',
    'signup.terms': 'Terms and Conditions',
    'signup.and': 'and',
    'signup.privacy': 'Privacy Policy',
    'signup.createAccount': 'Create Account',
    'signup.alreadyHaveAccount': 'Already have an account?',
    'signup.signIn': 'Sign in',
    'signup.orContinueWith': 'Or continue with',
    'signup.backToHome': 'Back to home',
    // Dashboard
    'dashboard.overview': 'Overview',
    'dashboard.timeline': 'Timeline',
    'dashboard.guests': 'Guests',
    'dashboard.budget': 'Budget',
    'dashboard.settings': 'Settings',
    'dashboard.logout': 'Logout',
    'dashboard.notifications': 'Notifications',
    'dashboard.daysLeft': 'Days Left',
    'dashboard.guestList': 'Guest List',
    'dashboard.budgetUsed': 'Budget Used',
    'dashboard.tasksDone': 'Tasks Done',
    'dashboard.planningProgress': 'Planning Progress',
    'dashboard.upcomingTasks': 'Upcoming Tasks',
    'dashboard.venue': 'Venue & Catering',
    'dashboard.decorations': 'Decorations',
    'dashboard.music': 'Music & Entertainment',
    'dashboard.weddingDate': 'Wedding Date',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = React.useState<'en' | 'ro'>('ro');

  const t = (key: string): string => {
    return translations[language][key] || key;
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
