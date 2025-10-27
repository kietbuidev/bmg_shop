import {I18n} from 'i18n-js';
import vi from './translate/vi.json';
import en from './translate/en.json';

const i18n = new I18n({en, vi});
i18n.enableFallback = true;
export default i18n;
