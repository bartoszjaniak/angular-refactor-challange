import { APP_INITIALIZER, LOCALE_ID, Injectable, inject } from '@angular/core';
import { I18NEXT_SERVICE, ITranslationService, defaultInterpolationFormat, I18NextModule } from 'angular-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const i18nextOptions = {
  debug: true,
  fallbackLng: 'en',
  detection: {
    order: ['localStorage', 'navigator', 'htmlTag'],
    caches: ['localStorage']
  },
  resources: {},
  interpolation: {
    format: I18NextModule.interpolationFormat(defaultInterpolationFormat)
  }
};

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translationsCache = new Map<string, any>();
  private i18next = inject(I18NEXT_SERVICE);

  constructor() { }

  async loadTranslations(language: string): Promise<any> {
    if (this.translationsCache.has(language)) {
      return this.translationsCache.get(language);
    }

    try {
      const response = await fetch(`/assets/i18n/${language}.json`);
      const translations = await response.json();
      this.translationsCache.set(language, translations);
      return translations;
    } catch (error) {
      console.error(`Failed to load translations for ${language}:`, error);
      return {};
    }
  }

  async changeLanguage(newLanguage: string): Promise<void> {
    const translations = await this.loadTranslations(newLanguage);
    this.i18next.addResourceBundle(newLanguage, 'translation', translations, true, true);
    await this.i18next.changeLanguage(newLanguage); // it saving new language to localStorage
  }
}

export function appInit(i18next: ITranslationService, translationService: TranslationService) {
  return async () => {
    await i18next.use(LanguageDetector).init(i18nextOptions);

    // Load initial translations
    const currentLanguage = i18next.language || i18nextOptions.fallbackLng;
    const translations = await translationService.loadTranslations(currentLanguage);
    i18next.addResourceBundle(currentLanguage, 'translation', translations, true, true);
  };
}

export function localeIdFactory(i18next: ITranslationService) {
  return i18next.language;
}

export const I18N_PROVIDERS = [
  TranslationService,
  {
    provide: APP_INITIALIZER,
    useFactory: appInit,
    deps: [I18NEXT_SERVICE, TranslationService],
    multi: true
  },
  {
    provide: LOCALE_ID,
    useFactory: localeIdFactory,
    deps: [I18NEXT_SERVICE]
  }
];