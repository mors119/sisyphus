import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    manifest_version: 3,
    name: '어디서든지 사용 가능한 단어장 Sisyphus-Word-Extension',
    version: '1.0',
    host_permissions: ['<all_urls>'],
    // TODO: 배포 시 반드시 삭제
    content_security_policy: {
      extension_pages:
        "script-src 'self' http://localhost:3000; object-src 'self'; connect-src http://localhost:8080",
    },
    oauth2: {
      client_id: 'xxxxxx.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
    },
    permissions: [
      'contextMenus',
      'storage',
      'activeTab',
      'scripting',
      'tabs',
      'identity',
    ],
    action: {
      default_popup: 'entrypoints/popup.html',
    },
    background: {
      service_worker: 'entrypoints/background.ts',
      type: 'module',
    },
  },
});
