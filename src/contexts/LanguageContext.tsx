
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ro' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  ro: {
    // Header
    'nav.features': 'Funcții',
    'nav.vendors': 'Furnizori',
    'nav.pricing': 'Prețuri',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.getStarted': 'Începe Acum',
    
    // Hero Section
    'hero.title': 'Planifică-ți Ziua Perfectă cu',
    'hero.titleAccent': 'Ușurință',
    'hero.subtitle': 'Nunta360 ajută cuplurile românești să gestioneze fiecare detaliu al nunții lor—de la lista de invitați la rezervările furnizorilor. Fă ziua ta specială de neuitat cu instrumentele noastre intuitive de planificare.',
    'hero.startPlanning': 'Începe Planificarea',
    'hero.exploreFeatures': 'Explorează Funcțiile',
    
    // Features Section
    'features.title': 'Tot Ce Ai Nevoie Pentru',
    'features.titleAccent': 'Nunta Ta de Vis',
    'features.subtitle': 'Instrumentele noastre complete de planificare te ajută să organizezi fiecare aspect al nunții cu ușurință și încredere.',
    'features.vendorDiscovery': 'Descoperirea Furnizorilor',
    'features.vendorDescription': 'Găsește și conectează-te cu furnizori de nuntă de încredere din zona ta. De la fotografi la catering, descoperă echipa perfectă pentru ziua ta specială.',
    'features.budgetPlanning': 'Planificarea Bugetului',
    'features.budgetDescription': 'Ține evidența cheltuielilor de nuntă cu planificatorul nostru intuitiv de buget. Stabilește limite, monitorizează cheltuielile și rămâi pe drumul cel bun financiar.',
    'features.guestManagement': 'Gestionarea Invitaților',
    'features.guestDescription': 'Gestionează cu ușurință lista de invitați, trimite invitații și urmărește confirmările într-un singur loc. Fă aranjamentele pentru locuri o plăcere.',
    'features.timelineSync': 'Sincronizarea Programului',
    'features.timelineDescription': 'Coordonează fiecare detaliu cu funcția noastră inteligentă de cronologie. Sincronizează cu calendarul tău și nu rata niciodată o dată importantă.',
    
    // Showcase Section
    'showcase.title': 'Au Avut Încredere în Noi Sute de',
    'showcase.titleAccent': 'Cupluri Românești',
    'showcase.subtitle': 'Alătură-te miilor de cupluri care și-au planificat nunta perfectă cu Nunta360',
    'showcase.testimonial1': 'Nunta360 ne-a făcut planificarea nunții mult mai ușoară! Puteam urmări totul într-un singur loc.',
    'showcase.testimonial2': 'Funcția de descoperire a furnizorilor ne-a ajutat să găsim profesioniști locali minunați. Recomand cu încredere!',
    'showcase.testimonial3': 'Planificarea bugetului a fost o plăcere cu această aplicație. Am rămas în buget și am avut nunta de vis.',
    'showcase.stats.couples': 'Cupluri Fericite',
    'showcase.stats.vendors': 'Furnizori',
    'showcase.stats.cities': 'Orașe',
    'showcase.stats.satisfaction': 'Satisfacție',
    
    // Product Preview
    'product.title': 'Planifică, Personalizează, Sărbătorește —',
    'product.titleAccent': 'Totul într-o Singură Aplicație',
    'product.subtitle': 'Descoperă cum Nunta360 simplifică fiecare aspect al călătoriei tale de planificare a nunții',
    'product.guestList': 'Manager Lista Invitați',
    'product.budgetTracker': 'Urmăritor Buget',
    'product.vendorDirectory': 'Director Furnizori',
    'product.timelinePlanner': 'Planificator Cronologie',
    'product.feature1.title': 'Gestionare Inteligentă a Invitaților',
    'product.feature1.description': 'Organizează lista de invitați, urmărește confirmările și gestionează cerințele dietetice într-o interfață intuitivă.',
    'product.feature2.title': 'Planificare Inteligentă a Bugetului',
    'product.feature2.description': 'Stabilește bugete, urmărește cheltuielile și primește informații pentru a lua decizii informate despre cheltuielile nunții.',
    'product.feature3.title': 'Rețea Curată de Furnizori',
    'product.feature3.description': 'Accesează rețeaua noastră verificată de profesioniști români pentru nunți și citește recenzii autentice de la alte cupluri.',
    
    // CTA Banner
    'cta.title': 'Gata să Îți Începi Călătoria',
    'cta.titleAccent': 'Împreună?',
    'cta.subtitle': 'Alătură-te miilor de cupluri românești care au avut încredere în Nunta360 pentru a-și planifica ziua perfectă de nuntă. Începe contul tău gratuit astăzi și începe să planifici sărbătoarea unei vieți.',
    'cta.createAccount': 'Creează Contul Tău Gratuit',
    'cta.trial': 'Nu necesită card de credit • Încercare gratuită de 14 zile • Anulare oricând',
    
    // Footer
    'footer.tagline': 'Facem planificarea nunții frumoasă, simplă și fără stres pentru cuplurile românești.',
    'footer.product': 'Produs',
    'footer.support': 'Suport',
    'footer.legal': 'Legal',
    'footer.helpCenter': 'Centru de Ajutor',
    'footer.contactUs': 'Contactează-ne',
    'footer.weddingGuide': 'Ghid de Nuntă',
    'footer.privacyPolicy': 'Politica de Confidențialitate',
    'footer.termsOfService': 'Termenii de Utilizare',
    'footer.cookiePolicy': 'Politica Cookie',
    'footer.copyright': '© 2024 Nunta360. Toate drepturile rezervate. Făcut cu ❤️ în România.'
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
    'hero.title': 'Plan Your Perfect Day with',
    'hero.titleAccent': 'Ease',
    'hero.subtitle': 'Nunta360 helps Romanian couples manage every detail of their wedding—from guest lists to vendor bookings. Make your special day unforgettable with our intuitive planning tools.',
    'hero.startPlanning': 'Start Planning',
    'hero.exploreFeatures': 'Explore Features',
    
    // Features Section
    'features.title': 'Everything You Need for Your',
    'features.titleAccent': 'Dream Wedding',
    'features.subtitle': 'Our comprehensive planning tools help you organize every aspect of your wedding with ease and confidence.',
    'features.vendorDiscovery': 'Vendor Discovery',
    'features.vendorDescription': 'Find and connect with trusted Romanian wedding vendors in your area. From photographers to caterers, discover the perfect team for your special day.',
    'features.budgetPlanning': 'Budget Planning',
    'features.budgetDescription': 'Keep track of your wedding expenses with our intuitive budget planner. Set limits, monitor spending, and stay on track financially.',
    'features.guestManagement': 'Guest Management',
    'features.guestDescription': 'Easily manage your guest list, send invitations, and track RSVPs all in one place. Make seating arrangements a breeze.',
    'features.timelineSync': 'Timeline Sync',
    'features.timelineDescription': 'Coordinate every detail with our smart timeline feature. Sync with your calendar and never miss an important deadline.',
    
    // Showcase Section
    'showcase.title': 'Trusted by Hundreds of',
    'showcase.titleAccent': 'Romanian Couples',
    'showcase.subtitle': 'Join thousands of couples who planned their perfect wedding with Nunta360',
    'showcase.testimonial1': 'Nunta360 made our wedding planning so much easier! We could track everything in one place.',
    'showcase.testimonial2': 'The vendor discovery feature helped us find amazing local professionals. Highly recommended!',
    'showcase.testimonial3': 'Budget planning was a breeze with this app. We stayed within our budget and had our dream wedding.',
    'showcase.stats.couples': 'Happy Couples',
    'showcase.stats.vendors': 'Vendors',
    'showcase.stats.cities': 'Cities',
    'showcase.stats.satisfaction': 'Satisfaction',
    
    // Product Preview
    'product.title': 'Plan, Customize, Celebrate —',
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
    'cta.title': 'Ready to Start Your Journey',
    'cta.titleAccent': 'Together?',
    'cta.subtitle': 'Join thousands of Romanian couples who trusted Nunta360 to plan their perfect wedding day. Start your free account today and begin planning the celebration of a lifetime.',
    'cta.createAccount': 'Create Your Free Account',
    'cta.trial': 'No credit card required • 14-day free trial • Cancel anytime',
    
    // Footer
    'footer.tagline': 'Making wedding planning beautiful, simple, and stress-free for Romanian couples.',
    'footer.product': 'Product',
    'footer.support': 'Support',
    'footer.legal': 'Legal',
    'footer.helpCenter': 'Help Center',
    'footer.contactUs': 'Contact Us',
    'footer.weddingGuide': 'Wedding Guide',
    'footer.privacyPolicy': 'Privacy Policy',
    'footer.termsOfService': 'Terms of Service',
    'footer.cookiePolicy': 'Cookie Policy',
    'footer.copyright': '© 2024 Nunta360. All rights reserved. Made with ❤️ in Romania.'
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ro');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
