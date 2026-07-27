import { useEffect } from 'react';

import { ExpansionProgress } from '../knowledge/ExpansionProgress.container';
import { KnowledgeReview } from '../knowledge/KnowledgeReview.container';
import { useExpansionPipeline } from '../knowledge/useExpansionPipeline.hook';
import { useWordInput } from '../knowledge/useWordInput.hook';
import { WordInput } from '../knowledge/WordInput.container';
import { PageContent, PageLayout } from '@/features/layout';

const AddPage = () => {
  const workspace = useWordInput();
  const expansion = useExpansionPipeline(
    workspace.word,
    workspace.phase === 'expanding',
  );

  const { enterReview, phase, reset } = workspace;

  useEffect(() => {
    if (phase === 'expanding' && expansion.isReadyForReview) {
      enterReview();
    }
  }, [phase, expansion.isReadyForReview, enterReview]);

  return (
    <PageLayout className="min-h-[calc(100vh-var(--header-height,4rem))] justify-center">
      <PageContent width="wide">
        {workspace.phase === 'reviewing' ? (
          <KnowledgeReview
            word={workspace.word}
            enabled={workspace.phase === 'reviewing'}
            onSaved={reset}
          />
        ) : workspace.phase === 'expanding' ? (
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
