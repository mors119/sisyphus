import { ImageUploaderForm } from '../view/ImageUploader.container';

const RequirePage = () => {
  // TODO: comment
  // TODO: admin(status, ListAll, delete, update)
  return (
    // <CustomCard
    //   title={
    //     <div className="flex justify-between">
    //       <h1>요청사항</h1>
    //       <Button onClick={() => setFormOpen(!formOpen)}>
    //         <Plus />
    //         요청하기
    //       </Button>
    //     </div>
    //   }
    //   description={
    //     '요청사항을 편안하게 작성해주세요. 빠르게 더 좋은 컨텐츠로 답해드리겠습니다.'
    //   }
    //   content={
    //     <div className="border-t mt-3 pt-3">
    //       <RequireFormField formOpen={formOpen} />
    //       <RequireField />
    //     </div>
    //   }
    //   footer={<span className="w-full text-end">heesk0223@gmail.com</span>}
    // />
    <ImageUploaderForm />
  );
};

export default RequirePage;
