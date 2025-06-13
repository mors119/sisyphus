import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['contextMenus', 'storage', 'activeTab', 'scripting', 'tabs'],
    host_permissions: ['<all_urls>'],
    manifest_version: 3,
    name: '어디서든지 사용 가능한 단어장 sisyphus-academy',
    version: '1.0',
    action: {
      default_popup: 'entrypoints/popup.html',
    },
    background: {
      service_worker: 'entrypoints/background.ts',
      type: 'module',
    },
  },
});
