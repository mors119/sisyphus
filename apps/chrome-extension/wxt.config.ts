import { defineConfig } from 'wxt';

// (role) env flag, type: boolean
const isDev =
  process.env.WXT_DEV === 'true' || process.env.WXT_MODE === 'development';

export default defineConfig({
  browser: 'chrome',
  manifestVersion: 3,
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: '어디서든지 사용 가능한 단어장 Sisyphus-Word-Extension',
    version: '1.0',
    default_locale: 'en',
    //  dev에서만 localhost 허용
    ...(isDev
      ? {
          content_security_policy: {
            extension_pages:
              "script-src 'self' http://localhost:3000; object-src 'self'; connect-src http://localhost:8080 https://sisyphus.mors.world;",
          },
        }
      : {
          content_security_policy: {
            extension_pages:
              "script-src 'self'; object-src 'self'; connect-src https://sisyphus.mors.world;",
          },
        }),

    oauth2: {
      client_id: 'xxxxxx.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
    },

    permissions: [
      'contextMenus',
      'storage',
      'activeTab',
      'scripting',
      'identity',
    ],

    action: {
      default_popup: 'popup.html',
    },

    commands: {
      'open-selection': {
        suggested_key: {
          default: 'Alt+S',
          mac: 'Alt+S',
        },
        description: 'Add selected text to vocabulary',
      },
    },

    background: {
      service_worker: 'entrypoints/background.ts',
      type: 'module',
    },
  },
});
