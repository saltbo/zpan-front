import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const DEFAULT_LANG = 'en'
const LOCALE_KEY = 'zpan-locale'
const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)

function loadLocaleMessages() {
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

const i18n = new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || DEFAULT_LANG,
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || DEFAULT_LANG,
  messages: loadLocaleMessages()
})


export const setup = lang => {
  let locale = localStorage.getItem(LOCALE_KEY);
  if (lang) {
    locale = lang
    localStorage.setItem(LOCALE_KEY, locale);
  } else if (!locale) {
    locale = navigator.language
  }

  Vue.config.locale = locale
  i18n.locale = locale
}

setup()
export default i18n