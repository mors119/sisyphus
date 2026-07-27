import { useTranslation } from 'react-i18next';

import { ErrorNotice } from '@/components/custom/Error';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/features/layout';

import { WordInputWorkspace } from './word.types';

type WordInputProps = {
  workspace: WordInputWorkspace;
};

export const WordInput = ({ workspace }: WordInputProps) => {
  const { t } = useTranslation();
  const {
    word,
    setWord,
    fieldError,
    pageError,
    isSubmitting,
    submit,
    retry,
  } = workspace;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submit();
  };

  return (
    <section
      aria-labelledby="word-input-heading"
      className="mx-auto flex w-full max-w-xl flex-col gap-8 py-6 md:py-12">
      <PageHeader
        title={
          <span id="word-input-heading">{t('knowledge.input.prompt')}</span>
        }
      />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6"
        noValidate>
        <Field
          label={t('knowledge.input.label')}
          error={fieldError}
          required>
          <Input
            name="word"
            autoComplete="off"
            autoFocus
            enterKeyHint="go"
            placeholder={t('knowledge.input.placeholder')}
            value={word}
            disabled={isSubmitting}
            className="h-12 text-base md:text-lg"
            onChange={(event) => setWord(event.target.value)}
          />
        </Field>

        {pageError ? (
          <ErrorNotice
            title={t(`knowledge.input.errors.${pageError}`)}
            description={t('knowledge.input.errors.preserved')}
            action={
              pageError === 'request' ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => void retry()}>
                  {t('knowledge.input.actions.retry')}
                </Button>
              ) : null
            }
          />
        ) : null}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          loadingLabel={t('knowledge.input.actions.expanding')}
          disabled={isSubmitting}
          className="w-full sm:w-auto sm:self-end">
          {t('knowledge.input.actions.expand')}
        </Button>
      </form>
    </section>
  );
};
