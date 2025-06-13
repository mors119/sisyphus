import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';

import { CustomCard } from '@/components/custom/custom-card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { FcGoogle } from 'react-icons/fc';
import { SiNaver } from 'react-icons/si';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { CustomAlert } from '@/components/custom/custom-alert';

import { useLocation, useNavigate } from 'react-router-dom';
import { userDeleteApi, userDetailApi } from '@/services/user/route';
import { UserWithAccountResponse } from '@/types/user';

import { userSchema, UserForm } from '@/lib/validations/user';
import { useAlert } from '@/hooks/use-alert';
import { formatDate } from '@/utils/format-date';

const UserPage = () => {
  const location = useLocation();
  const [read] = useState(true); // TODO: 수정 페이지 만들 떄, setRead
  const [isLoading, setIsLoading] = useState(false);
  const [userDetailData, setUserDetailData] =
    useState<UserWithAccountResponse>();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { alertMessage } = useAlert();
  const navigate = useNavigate();

  const form = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      joinedAt: '',
    },
    mode: 'onBlur',
  });

  // TODO: 수정 submit
  const onSubmit = (data: UserForm) => {
    console.log('회원 정보 제출됨:', data);
    try {
      setIsLoading(true);
      // TODO: userUpdateApi
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // USER 페이지 시 Detail 데이터 로딩
  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const userDetail: UserWithAccountResponse = await userDetailApi();

        setUserDetailData(userDetail);
      } catch (err) {
        console.error('유저 상세 정보 로딩 실패:', err);
      }
    };

    if (location.pathname === '/user') fetchUserDetail();
  }, [location.pathname]);

  // 회원 탈퇴
  const deleteAccount = async () => {
    try {
      await userDeleteApi(); // HTTP 204 기대

      useAuthStore.getState().clear();
      localStorage.removeItem('auth-storage');
      navigate('/');

      alertMessage('모든 정보가 삭제되었습니다.', {
        description: '이용해주셔서 감사합니다.',
        duration: 5000,
      });
    } catch (err) {
      alertMessage('Error', {
        description: `${err}`,
        duration: 5000,
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <CustomCard
        title={
          <div className="flex justify-between items-center">
            <h2>회원 정보</h2>
            <Logo />
          </div>
        }
        description="내 정보를 확인하고 수정할 수 있어요."
        content={
          <>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이름</FormLabel>
                      <FormControl>
                        <Input
                          className={cn(
                            read &&
                              'border-none shadow-none focus-visible:ring-0 focus-visible:ring-transparent focus:ring-0 focus:border-transparent',
                          )}
                          placeholder="이름을 입력하세요"
                          {...field}
                          disabled
                          readOnly={read}
                          value={userDetailData?.userName ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이메일</FormLabel>
                      <FormControl>
                        <Input
                          className={cn(
                            read &&
                              'border-none shadow-none focus-visible:ring-0 focus-visible:ring-transparent focus:ring-0 focus:border-transparent',
                          )}
                          placeholder="이메일을 입력하세요"
                          {...field}
                          disabled
                          readOnly={read}
                          value={userDetailData?.userEmail ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="joinedAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>가입일</FormLabel>
                      <FormControl>
                        <Input
                          className={cn(
                            read &&
                              'border-none shadow-none focus-visible:ring-0 focus-visible:ring-transparent focus:ring-0 focus:border-transparent',
                          )}
                          {...field}
                          value={
                            formatDate(
                              userDetailData?.createdAt,
                              'YYYY년 MM월 DD일',
                            ) ?? ''
                          }
                          disabled
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {read && (
                  <div>
                    <h4 className="flex mb-4 items-center gap-2 text-sm font-medium">
                      연동된 계정
                    </h4>
                    <div className="flex items-center gap-2">
                      {userDetailData?.accounts.some(
                        (acc) => acc.provider === 'camus',
                      ) && (
                        <Button
                          variant="outline"
                          type="button"
                          className=""
                          disabled={isLoading}>
                          <img
                            src="diagram-logo.png"
                            alt="diagram logo"
                            className="size-5 block"
                          />
                          <span className="sm:inline-block hidden">
                            SISYPHUS
                          </span>
                        </Button>
                      )}

                      {userDetailData?.accounts.some(
                        (acc) => acc.provider === 'google',
                      ) && (
                        <Button
                          variant="outline"
                          type="button"
                          className=""
                          disabled={isLoading}
                          // onClick={() =>
                          //   (window.location.href =
                          //     '/oauth2/authorization/google?mode=link')
                          // }
                        >
                          <FcGoogle size={22} />
                          <span className="sm:inline-block hidden">Google</span>
                        </Button>
                      )}

                      {userDetailData?.accounts.some(
                        (acc) => acc.provider === 'naver',
                      ) && (
                        <Button
                          variant="outline"
                          type="button"
                          className=" bg-[#00c75a] hover:bg-[#00c75a]/60"
                          disabled={isLoading}
                          // onClick={() =>
                          //   (window.location.href =
                          //     '/oauth2/authorization/naver?mode=link')
                          // }
                        >
                          <SiNaver size={16} color="white" />
                          <span className="sm:inline-block hidden">Naver</span>
                        </Button>
                      )}

                      {userDetailData?.accounts.some(
                        (acc) => acc.provider === 'kakao',
                      ) && (
                        <Button
                          variant="outline"
                          type="button"
                          className=" bg-[#f9e000] text-[#3c1f1f] hover:bg-[#f9e000]/60"
                          disabled={isLoading}
                          // onClick={() =>
                          //   (window.location.href =
                          //     '/oauth2/authorization/kakao?mode=link')
                          // }
                        >
                          <RiKakaoTalkFill size={20} color="#3c1f1f" />
                          <span className="sm:inline-block hidden">Kakao</span>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowDeleteDialog(true)}>
                    회원 탈퇴
                  </Button>
                </div>
              </form>
            </Form>
          </>
        }
      />
      <CustomAlert
        title="정말 회원 정보를 삭제하시겠습니까?"
        desc={
          <div>
            확인버튼을 클릭하시면
            <strong className="text-red-600">
              회원 정보와 기록하신 모든 정보가 삭제
            </strong>
            됩니다.
            <br /> 삭제 후에는
            <strong className="text-red-600">복구가 불가능</strong>
            합니다.
          </div>
        }
        action="모든 정보 삭제하기"
        setOpen={setShowDeleteDialog}
        open={showDeleteDialog}
        onAction={deleteAccount}
      />
    </div>
  );
};

export default UserPage;
