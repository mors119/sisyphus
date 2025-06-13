import { Category } from '@/types/note';

export const useNoteLabels = (category: Category) => {
  const getTitleLabel = () => {
    switch (category) {
      case 'WORD':
        return 'WORD';
      case 'TODO':
        return 'TASK';
      default:
        return 'TITLE';
    }
  };

  const getSubTitleLabel = () => {
    switch (category) {
      case 'WORD':
        return 'MEANING';
      case 'TODO':
        return 'DEADLINE';
      default:
        return 'SUBTITLE';
    }
  };

  return {
    titleLabel: getTitleLabel(),
    subTitleLabel: getSubTitleLabel(),
  };
};
