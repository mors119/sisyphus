import { CustomCard } from '@/components/custom/customCard';
import { ViewFormField } from '../view/ViewForm.container';

const AddPage = () => {
  return (
    <div>
      <CustomCard content={<ViewFormField />} />
    </div>
  );
};

export default AddPage;
