// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translations
const resources = {
  en: {
    translation: {
      // Home Page
      welcome: "Welcome back,",
      name: "Henry!",
      subtitle: "Let's make your hospital visit faster and smarter",
      bookAppointments: "Book\nAppointments",
      myAppointment: "My\nAppointment",
      trackQueue: "Track\nQueue",
      qrCode: "QR\nCode",
      
      // TrackQueue Page
      queue: {
        yourPosition: "Your position",
        notInQueue: "Not in queue",
        currentlyServing: "Currently serving",
        none: "None",
        estimatedWait: "Estimated wait time",
        queuePositions: "Queue Positions",
        position: "Position",
        bookedByOthers: "Booked by others",
        available: "Available",
        filterByLocation: "Filter by location",
        filterByDepartment: "Filter by department",
        selectLocation: "Select location",
        selectDepartment: "Select department",
        resetFilters: "Reset filters"
      },      
      waitTime: {
        unknown: "Unknown",
        now: "Now",
        min: "min"
      },
      loading: "Loading queue data...",
      error: {
        title: "Error loading queue",
        retry: "Retry"
      },
      apiError: {
        title: "API Error",
        loadQueueFailed: "Failed to load queue data"
      }
    }
  },
  ta: {
    translation: {
      // Home Page
      welcome: "மீண்டும் வருக,",
      name: "ஹென்றி!",
      subtitle: "உங்கள் மருத்துவமனை வருகையை வேகமாகவும் புத்திசாலித்தனமாகவும் மாற்றுவோம்",
      bookAppointments: "நேரத்தை\nபதிவு செய்க",
      myAppointment: "என்னுடைய\nநேரப்பதிவு",
      trackQueue: "வரிசையை\nகண்காணிக்க",
      qrCode: "QR\nகுறியீடு",
      
      // TrackQueue Page
      queue: {
        yourPosition: "உங்கள் நிலை",
        notInQueue: "வரிசையில் இல்லை",
        currentlyServing: "தற்போது சேவை செய்கிறது",
        none: "ஒன்றுமில்லை",
        estimatedWait: "மதிப்பிடப்பட்ட காத்திருப்பு நேரம்",
        queuePositions: "வரிசை நிலைகள்",
        position: "நிலை",
        bookedByOthers: "மற்றவர்களால் பதிவு செய்யப்பட்டது",
        available: "கிடைக்கிறது"
      },
      waitTime: {
        unknown: "தெரியவில்லை",
        now: "இப்போது",
        min: "நிமிடங்கள்"
      },
      loading: "வரிசை தரவு ஏற்றப்படுகிறது...",
      error: {
        title: "வரிசையை ஏற்றுவதில் பிழை",
        retry: "மீண்டும் முயற்சிக்கவும்"
      },
      apiError: {
        title: "API பிழை",
        loadQueueFailed: "வரிசை தரவை ஏற்ற முடியவில்லை"
      }
    }
  },
  si: {
    translation: {
      // Home Page
      welcome: "නැවත සාදරයෙන් පිළිගනිමු,",
      name: "හෙන්රි!",
      subtitle: "ඔබේ රෝහල් ගමන වේගවත් හා ඥානවන්ත කරමු",
      bookAppointments: "වේලාවන්\nවෙන්කරගන්න",
      myAppointment: "මගේ\nවෙන්කරගත් වේලාව",
      trackQueue: "පෝලිම\nඅවධානයෙන් සිටින්න",
      qrCode: "QR\nකේතය",
      
      // TrackQueue Page
      queue: {
        yourPosition: "ඔබේ ස්ථානය",
        notInQueue: "පෝලිමේ නැත",
        currentlyServing: "දැන් සේවය කරයි",
        none: "කිසිවක් නැත",
        estimatedWait: "ඇස්තමේන්තුගත රැඳීමේ කාලය",
        queuePositions: "පෝලිමේ ස්ථාන",
        position: "ස්ථානය",
        bookedByOthers: "අන් අය විසින් වෙන්කරගෙන ඇත",
        available: "ඉඩ තිබේ"
      },
      waitTime: {
        unknown: "නොදනී",
        now: "දැන්",
        min: "මිනිත්තු"
      },
      loading: "පෝලිමේ දත්ත ලබා ගනිමින්...",
      error: {
        title: "පෝලිම පූරණය කිරීමේ දෝෂයක්",
        retry: "නැවත උත්සාහ කරන්න"
      },
      apiError: {
        title: "API දෝෂය",
        loadQueueFailed: "පෝලිමේ දත්ත ලබා ගැනීමට අසමත් විය"
      }
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