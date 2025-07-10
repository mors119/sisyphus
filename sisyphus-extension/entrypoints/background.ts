import { defineBackground } from 'wxt/sandbox';

export default defineBackground(() => {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: 'showSelectedWord',
      title: '단어장에 추가하기',
      contexts: ['selection'],
    });
  });

  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (!info.selectionText) return;

    const selectedWord = info.selectionText;

    if (info.menuItemId === 'showSelectedWord') {
      chrome.storage.local.set({ selectedWord }, () => {
        // 팝업이 있는 경우에만 열림 (Manifest에 지정된 action.default_popup 필요)
        chrome.action.openPopup().catch((err) => {
          console.warn(
            '팝업을 열 수 없습니다. 이미 열려있거나 popup이 설정되지 않았을 수 있습니다.',
            err,
          );
        });
      });
    }
  });
});
