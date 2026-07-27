import { ExpansionProgress } from '../knowledge/ExpansionProgress.container';
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

  return (
    <PageLayout className="min-h-[calc(100vh-var(--header-height,4rem))] justify-center">
      <PageContent width="wide">
        {workspace.phase === 'expanding' ? (
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
