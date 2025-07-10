import { defineContentScript } from 'wxt/sandbox';

// let selectionButton: HTMLButtonElement | null = null; // 버튼 요소를 전역 변수로 관리

// /**
//  * 텍스트 선택 시 나타나는 버튼을 생성하고 스타일을 적용합니다.
//  * @param onClickHandler 버튼 클릭 시 실행될 콜백 함수
//  * @returns 생성된 버튼 요소
//  */
// function createSelectionButton(
//   onClickHandler: (selectedText: string) => void,
// ): HTMLButtonElement {
//   const button = document.createElement('button');
//   button.textContent = '추가하기';
//   Object.assign(button.style, {
//     position: 'absolute',
//     zIndex: '9999',
//     padding: '6px 10px',
//     borderRadius: '6px',
//     background: '#333',
//     color: '#fff',
//     fontSize: '12px',
//     border: 'none',
//     cursor: 'pointer',
//   });

//   button.addEventListener('click', () => {
//     const selectedText = window.getSelection()?.toString().trim();
//     if (selectedText) {
//       onClickHandler(selectedText);
//     }
//     removeSelectionButton(); // 클릭 후 버튼 제거
//   });
//   return button;
// }

// /**
//  * 버튼의 위치를 업데이트합니다.
//  * @param x X 좌표
//  * @param y Y 좌표
//  */
// function updateButtonPosition(x: number, y: number) {
//   if (selectionButton) {
//     selectionButton.style.left = `${x + 10}px`;
//     selectionButton.style.top = `${y + 10}px`;
//   }
// }

// /**
//  * 현재 표시된 버튼을 제거합니다.
//  */
// function removeSelectionButton() {
//   selectionButton?.remove();
//   selectionButton = null;
// }

// // --- 데이터 저장 관련 함수 (단일 책임 원칙: 데이터 저장) ---
// /**
//  * 선택된 단어를 Chrome Local Storage에 저장합니다.
//  * @param word 저장할 단어
//  */
// function saveWordToStorage(word: string) {
//   chrome.storage.local.set({ selectedWord: word }, () => {
//     console.log('저장 완료:', word);
//   });
// }

// --- 메인 로직 (모든 기능을 조합) ---
export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    console.log('Hello world from content script!');

    //   // 마우스 업 이벤트를 감지하여 선택된 텍스트 처리
    //   document.addEventListener('mouseup', (e) => {
    //     const selectedText = window.getSelection()?.toString().trim();

    //     if (!selectedText) {
    //       removeSelectionButton(); // 텍스트 선택이 없으면 버튼 제거
    //       return;
    //     }

    //     // 선택된 텍스트가 있는데 버튼이 없으면 새로 생성
    //     if (!selectionButton) {
    //       selectionButton = createSelectionButton(saveWordToStorage); // 저장 함수를 콜백으로 전달
    //       document.body.appendChild(selectionButton);
    //     }

    //     updateButtonPosition(e.pageX, e.pageY); // 버튼 위치 업데이트
    //   });
  },
});
