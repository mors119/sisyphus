import { CategoryField } from './CategoryField.widget';
import { CategoryFormUnified } from './Category.form';
import { CustomCard } from '@/components/custom/customCard';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { useTranslation } from 'react-i18next';

const CategoryPage = () => {
  const { t } = useTranslation();
  return (
    <div className="relative h-full">
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel>
          <CustomCard
            title={t('category.page.category')}
            className="h-full space-y-1"
            content={<CategoryField condition={true} />}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <CustomCard
            title={t('category.page.add_edit')}
            className="h-full"
            content={<CategoryFormUnified />}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default CategoryPage;
