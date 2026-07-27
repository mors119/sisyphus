import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageContent, PageLayout } from '@/features/layout';
import { NoteResponse } from '../quick_edit/note.types';
import { SEARCH_ITEM } from '../layout/header/search.constants';

import { ExpansionProgress } from '../knowledge/ExpansionProgress.container';
import { KnowledgeCompletion } from '../knowledge/KnowledgeCompletion.container';
import { KnowledgeReview } from '../knowledge/KnowledgeReview.container';
import { useExpansionPipeline } from '../knowledge/useExpansionPipeline.hook';
import { useWordInput } from '../knowledge/useWordInput.hook';
import { WordInput } from '../knowledge/WordInput.container';

const AddPage = () => {
  const navigate = useNavigate();
  const workspace = useWordInput();
  const expansion = useExpansionPipeline(
    workspace.word,
    workspace.phase === 'expanding',
  );

  const { enterReview, phase, reset, createdNote, enterCompletion } = workspace;

  useEffect(() => {
    if (phase === 'expanding' && expansion.isReadyForReview) {
      enterReview();
    }
  }, [phase, expansion.isReadyForReview, enterReview]);

  const handleViewCreated = () => {
    if (!createdNote) return;

    const openNote: NoteResponse = {
      id: createdNote.id,
      title: createdNote.title,
      subTitle: createdNote.subTitle ?? '',
      description: createdNote.description ?? '',
      tags: [],
      createdAt: new Date().toISOString(),
      category: { id: 0, title: '', color: '' },
      image: [],
    };

    navigate(
      `/view?mode=search&type=${SEARCH_ITEM.NOTE}&id=${createdNote.id}&title=${encodeURIComponent(createdNote.title)}`,
      { state: { openNote } },
    );
  };

  return (
    <PageLayout className="min-h-[calc(100vh-var(--header-height,4rem))] justify-center">
      <PageContent width="wide">
        {phase === 'completed' && createdNote ? (
          <KnowledgeCompletion
            createdNote={createdNote}
            onAddAnother={reset}
            onViewCreated={handleViewCreated}
          />
        ) : phase === 'reviewing' ? (
          <KnowledgeReview
            word={workspace.word}
            enabled={phase === 'reviewing'}
            onCompleted={enterCompletion}
          />
        ) : phase === 'expanding' ? (
          <ExpansionProgress
            word={workspace.word}
            items={expansion.progressItems}
            announcement={expansion.announcement}
            onRetryStage={expansion.retryStage}
            onContinueStage={expansion.continueAfterFailure}
          />
        ) : (
          <WordInput workspace={workspace} />
        )}
      </PageContent>
    </PageLayout>
  );
};

export default AddPage;
