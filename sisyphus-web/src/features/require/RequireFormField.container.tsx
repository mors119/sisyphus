import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAlert } from '@/hooks/useAlert'; // 알림 훅
import { useCreateMutation } from '@/features/require/useRequireQuery.query';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { requireSchema } from './require.schema';
import { RequireForm } from './require.types';

interface RequireFormProps {
  formOpen: boolean;
}

export const RequireFormField = ({ formOpen }: RequireFormProps) => {
  const { alertMessage } = useAlert();
  const form = useForm<RequireForm>({
    resolver: zodResolver(requireSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const createMutation = useCreateMutation();

  const onSubmit = async (values: RequireForm) => {
    try {
      await createMutation.mutateAsync(values);
      alertMessage('✅ 요청이 성공적으로 제출되었습니다.');
      form.reset();
    } catch (err) {
      alertMessage('❌ 요청 제출 실패', {
        description: `잠시 후 다시 시도해주세요.\n${String(err)}`,
      });
    }
  };

  return (
    <Form {...form} key={'new'}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          'w-full bg-white rounded-md shadow-sm h-full space-y-4 max-h-0 hidden p-0 duration-300',
          formOpen && 'p-4 border max-h-full block mb-2',
        )}>
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TITLE</FormLabel>
              <FormControl>
                <Input
                  placeholder="예: 크롬 확장프로그램을 만들어주세요."
                  {...field}
                  disabled={createMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DESCRIPTION</FormLabel>
              <FormControl>
                <Textarea
                  className="w-full max-h-80"
                  placeholder="요청 내용을 상세히 입력해주세요."
                  disabled={createMutation.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-end">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};
