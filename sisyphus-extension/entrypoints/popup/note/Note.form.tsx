import { useTranslation } from 'react-i18next';
import { useNoteHook } from './useNote.hook';

export const NoteFormField = () => {
  const { register, handleSubmit, errors, isSubmitting } = useNoteHook();
  const { t } = useTranslation();
  return (
    <div>
      <form className="form_tag" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="title">{t('main.note.tit')}</label>
          <input
            id="title"
            type="text"
            placeholder={t('main.note.tit_place')}
            {...register('title', { required: t('main.note.tit_required') })}
          />
          {errors.title && <p className="error">{errors.title.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="subTitle">{t('main.note.sub')}</label>
          <input
            id="subTitle"
            type="text"
            placeholder={t('main.note.sub_place')}
            {...register('subTitle')}
          />
        </div>

        <button type="submit" className="save-button" disabled={isSubmitting}>
          {t(isSubmitting ? 'main.note.ing_save' : 'main.note.save')}
        </button>
      </form>
    </div>
  );
};
