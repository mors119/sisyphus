import { create } from 'zustand';

type MessageState = {
  msg: string | null;
  setMsg: (msg: string) => void;
};

export const useMessageStore = create<MessageState>()((set) => ({
  msg: null,
  setMsg: (msg: string) => {
    set(() => ({ msg })); // 메시지 설정
    setTimeout(() => {
      set(() => ({ msg: null })); // 2초 후 메시지 제거
    }, 2000);
  },
}));
