/** Shared translation labels for knowledge journey tests. */
export const knowledgeTestLabels: Record<string, string> = {
  'knowledge.input.prompt': '오늘 어떤 단어를 발견했나요?',
  'knowledge.input.label': '단어',
  'knowledge.input.placeholder': '단어를 입력하세요',
  'knowledge.input.actions.expand': '확장하기',
  'knowledge.input.actions.expanding': '확장 중',
  'knowledge.expansion.heading': '단어를 확장하는 중',
  'knowledge.expansion.description': '{{word}}에 대한 지식을 생성하고 있습니다.',
  'knowledge.expansion.wordLabel': '입력한 단어',
  'knowledge.expansion.label': '확장 진행',
  'knowledge.expansion.actions.retry': '다시 시도',
  'knowledge.expansion.actions.continue': '계속하기',
  'knowledge.expansion.stages.verifyWord': '단어 확인',
  'knowledge.expansion.stages.definition': '정의 생성',
  'knowledge.expansion.stages.image': '이미지 탐색',
  'knowledge.expansion.stages.metadata': '메타데이터 구성',
  'knowledge.expansion.stages.persistPrep': '저장 준비',
  'knowledge.expansion.errors.image': '이미지를 찾지 못했습니다.',
  'knowledge.expansion.announcements.active': '{{stage}} 단계를 진행 중입니다.',
  'knowledge.expansion.announcements.completed': '모든 확장 단계가 완료되었습니다.',
  'knowledge.expansion.announcements.partial':
    '일부 선택 단계를 건너뛰고 확장을 완료했습니다.',
  'knowledge.review.heading': '생성된 지식 검토',
  'knowledge.review.description': '{{word}}에 대한 생성 결과를 확인하고 수정하세요.',
  'knowledge.review.panelTitle': '검토 workspace',
  'knowledge.review.panelDescription':
    '각 섹션을 수정하거나 제외한 뒤 지식에 추가할 수 있습니다.',
  'knowledge.review.optional': '선택',
  'knowledge.review.empty': '내용 없음',
  'knowledge.review.sections.word': '단어',
  'knowledge.review.sections.pronunciation': '발음',
  'knowledge.review.sections.definitions': '정의',
  'knowledge.review.sections.image': '이미지',
  'knowledge.review.sections.example': '예문',
  'knowledge.review.sections.tags': '태그',
  'knowledge.review.sections.difficulty': '난이도',
  'knowledge.review.status.generated': '생성됨',
  'knowledge.review.status.edited': '수정됨',
  'knowledge.review.status.excluded': '제외됨',
  'knowledge.review.status.failed': '실패',
  'knowledge.review.status.regenerating': '재생성 중',
  'knowledge.review.actions.regenerate': '다시 생성',
  'knowledge.review.actions.regenerating': '다시 생성 중',
  'knowledge.review.actions.exclude': '제외',
  'knowledge.review.actions.restore': '복원',
  'knowledge.review.actions.applyEdit': '수정 적용',
  'knowledge.review.actions.addToKnowledge': '지식에 추가',
  'knowledge.review.actions.saving': '저장 중',
  'knowledge.completion.heading': '지식에 추가했습니다',
  'knowledge.completion.description': '{{word}}을(를) 지식에 추가했습니다.',
  'knowledge.completion.actions.addAnother': '새 단어 추가',
  'knowledge.completion.actions.viewCreated': '추가한 지식 보기',
  'knowledge.completion.actions.retrySave': '다시 저장',
  'knowledge.completion.errors.saveFailed': '저장하지 못했습니다.',
  'knowledge.completion.errors.preserved':
    '검토 화면의 수정 내용은 그대로 유지됩니다.',
  edit: '수정',
  cancel: '취소',
};

export function translateKnowledgeTestLabel(
  key: string,
  options?: Record<string, string>,
): string {
  const template = knowledgeTestLabels[key] ?? key;
  if (!options) return template;

  return Object.entries(options).reduce(
    (value, [name, replacement]) =>
      value.replace(new RegExp(`{{${name}}}`, 'g'), replacement),
    template,
  );
}
