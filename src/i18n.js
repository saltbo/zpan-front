import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

function loadLocaleMessages() {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
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
  locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages()
})

const DEFAULT_LANG = 'en'
const LOCALE_KEY = 'localeLanguage'

export const setup = lang => {
  let locale = localStorage.getItem(LOCALE_KEY);
  if (lang) {
    locale = lang
    localStorage.setItem(LOCALE_KEY, locale);
  } else if (!locale) {
    locale = locales[navigator.language] ? navigator.language : DEFAULT_LANG;
  }

  Vue.config.locale = locale
  i18n.locale = locale
  window.i18n = i18n
}

setup()
export default i18n