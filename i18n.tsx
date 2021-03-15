import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import resources from './src/translations/common.json';

i18n.use(initReactI18next).init({
  resources,
  lng: 'eng',

  keySeparator: false,

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
