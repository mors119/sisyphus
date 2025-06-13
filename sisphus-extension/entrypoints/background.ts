import { defineBackground } from 'wxt/sandbox';

export default defineBackground(() => {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: 'showSelectedWord',
      title: '단어장에 추가하기',
      contexts: ['selection'], // 사용자가 텍스트 선택한 경우에만 표시
    });
    chrome.contextMenus.create({
      id: 'showNewTab',
      title: '단어장에 추가하고 사이트로 이동하기',
      contexts: ['selection'],
    });
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'showSelectedWord' && info.selectionText) {
      // 선택한 단어를 popup에 전달
      chrome.storage.local.set({ selectedWord: info.selectionText }, () => {
        chrome.action.openPopup(); // 팝업 열기
      });
    }
    if (info.menuItemId === 'showNewTab' && info.selectionText) {
      // TODO: going homepage
      // 새탭에서 열기
      chrome.tabs.create({
        url: chrome.runtime.getURL('popup.html'),
      });
    }
  });
});
