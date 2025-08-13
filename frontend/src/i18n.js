// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translations
const resources = {
  en: {
    translation: {
      welcome: "Welcome back,",
      name: "Henry!",
      subtitle: "Let's make your hospital visit faster and smarter",
      bookAppointments: "Book\nAppointments",
      myAppointment: "My\nAppointment",
      trackQueue: "Track\nQueue",
      qrCode: "QR\nCode"
    }
  },
  ta: {
    translation: {
      welcome: "மீண்டும் வருக,",
      name: "ஹென்றி!",
      subtitle: "உங்கள் மருத்துவமனை வருகையை வேகமாகவும் புத்திசாலித்தனமாகவும் மாற்றுவோம்",
      bookAppointments: "நேரத்தை\nபதிவு செய்க",
      myAppointment: "என்னுடைய\nநேரப்பதிவு",
      trackQueue: "வரிசையை\nகண்காணிக்க",
      qrCode: "QR\nகுறியீடு"
    }
  },
  si: {
    translation: {
      welcome: "නැවත සාදරයෙන් පිළිගනිමු,",
      name: "හෙන්රි!",
      subtitle: "ඔබේ රෝහල් ගමන වේගවත් හා ඥානවන්ත කරමු",
      bookAppointments: "වේලාවන්\nවෙන්කරගන්න",
      myAppointment: "මගේ\nවෙන්කරගත් වේලාව",
      trackQueue: "පෝලිම\nඅවධානයෙන් සිටින්න",
      qrCode: "QR\nකේතය"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator'],
      caches: ['cookie']
    }
  });

export default i18n;