import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

import { CreatedKnowledgeNote } from './persistence.types';

type KnowledgeCompletionProps = {
  createdNote: CreatedKnowledgeNote;
  onAddAnother: () => void;
  onViewCreated: () => void;
};

export const KnowledgeCompletion = ({
  createdNote,
  onAddAnother,
  onViewCreated,
}: KnowledgeCompletionProps) => {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="knowledge-completion-heading"
      className="mx-auto flex w-full max-w-xl flex-col py-6 md:py-12">
      <Card className="animate-fade-up border-brand-accent-subtle">
        <CardHeader className="gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2
              className="mt-0.5 size-6 shrink-0 text-success"
              aria-hidden="true"
            />
            <div className="space-y-2">
              <h2
                data-flow-focus="true"
                tabIndex={-1}
                id="knowledge-completion-heading"
                className="text-xl font-semibold leading-none outline-none focus-visible:ring-[3px] focus-visible:ring-focus-ring/50">
                {t('knowledge.completion.heading')}
              </h2>
              <CardDescription>
                {t('knowledge.completion.description', {
                  word: createdNote.title,
                })}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onViewCreated}>
            {t('knowledge.completion.actions.viewCreated')}
          </Button>
          <Button type="button" variant="primary" onClick={onAddAnother}>
            {t('knowledge.completion.actions.addAnother')}
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
};
