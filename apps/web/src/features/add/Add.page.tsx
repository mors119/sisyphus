import { ExpansionProgress } from '../knowledge/ExpansionProgress.container';
import { useWordInput } from '../knowledge/useWordInput.hook';
import { WordInput } from '../knowledge/WordInput.container';
import { PageContent, PageLayout } from '@/features/layout';

const AddPage = () => {
  const workspace = useWordInput();

  return (
    <PageLayout className="min-h-[calc(100vh-var(--header-height,4rem))] justify-center">
      <PageContent width="wide">
        {workspace.phase === 'expanding' ? (
          <ExpansionProgress
            word={workspace.word}
            steps={workspace.expansionSteps}
          />
        ) : (
          <WordInput workspace={workspace} />
        )}
      </PageContent>
    </PageLayout>
  );
};

export default AddPage;
