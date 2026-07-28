import { CategoryField } from './CategoryField.widget';
import { CategoryFormUnified } from './Category.form';
import { CustomCard } from '@/components/custom/customCard';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { PageContent, PageHeader, PageLayout } from '@/features/layout';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';

const CategoryPage = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <PageLayout className="flex min-h-0 flex-1 flex-col py-0">
      <PageHeader title={t('item.category')} />

      <PageContent width="wide" className="flex min-h-0 flex-1 flex-col">
        <ResizablePanelGroup
          id="category-page"
          orientation={isMobile ? 'vertical' : 'horizontal'}
          className="min-h-0 flex-1 gap-3">
          <ResizablePanel id="category-list" defaultSize="50%" minSize="25%">
            <CustomCard
              title={t('category.page.category')}
              className="h-full"
              headerClassName="px-6 pb-0 pt-6"
              contentClassName="px-6 pb-6"
              content={<CategoryField condition={true} />}
            />
          </ResizablePanel>
          <ResizableHandle withHandle className={isMobile ? 'my-1' : 'mx-1'} />
          <ResizablePanel id="category-form" defaultSize="50%" minSize="25%">
            <CustomCard
              title={t('category.page.add_edit')}
              className="h-full"
              headerClassName="px-6 pb-0 pt-6"
              contentClassName="px-6 pb-6"
              content={<CategoryFormUnified />}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </PageContent>
    </PageLayout>
  );
};

export default CategoryPage;
