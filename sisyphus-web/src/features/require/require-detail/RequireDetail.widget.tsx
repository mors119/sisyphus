import { CustomCard } from '@/components/custom/customCard';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '@/components/custom/Empty';
import { ErrorState } from '@/components/custom/Error';
import { Loader } from '@/components/custom/Loader';
import { DeleteBtn, EditBtn } from '@/components/custom/Btn';
import { cn } from '@/lib/utils';
import { useDayjs } from '@/hooks/useDayjs.hook';

import {
  useDeleteRequireMutation,
  useRequireQuery,
  useRequireStatusUpdateMutation,
} from '../useRequireQuery.query';
import { RequireFormField } from '../require-write/RequireFormField.container';
import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/features/auth/auth.store';
import { useAlert } from '@/hooks/useAlert';
import {
  STATUS_FLOW,
  STATUS_LABELS,
  STATUS_TO_ENUM,
  StatusKey,
} from '../require.constants';
import { useTranslation } from 'react-i18next';

const nextStatusOf = (s: StatusKey): StatusKey =>
  STATUS_FLOW[(STATUS_FLOW.indexOf(s) + 1) % STATUS_FLOW.length];

interface Props {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const RequireDetailPage = ({ setIsOpen }: Props) => {
  const { alertMessage } = useAlert();
  const [searchParams, setSearchParams] = useSearchParams();
  const { formatDate } = useDayjs();
  const [isEdit, setIsEdit] = useState(false);
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const idParam = searchParams.get('id');
  const intId = idParam ? Number(idParam) : NaN;
  const isValidId = Number.isInteger(intId) && intId > 0;

  // 패치
  const { data, isLoading, isError } = useRequireQuery(intId, {
    enabled: isValidId,
  });

  // 삭제
  const deleteMutation = useDeleteRequireMutation({
    onSuccess: () => {
      const next = new URLSearchParams(searchParams);
      next.delete('id'); // URL에서 id 제거(모달/디테일 닫기)
      setSearchParams(next, { replace: true });
      setIsOpen(false);
    },
  });

  const handleDelete = () => {
    if (isValidId) {
      deleteMutation.mutate(intId);
    }
  };

  // 상태 업데이트
  const updateStatusMutation = useRequireStatusUpdateMutation({
    onSuccess: () => {
      // 성공시: pendingStatus를 지워 서버 데이터가 화면에 반영되게
      setPendingStatus(null);
      prevStatusRef.current = null;
      alertMessage(t('require.sheet.update'));
    },
    onError: (err) => {
      // 실패시: 이전 상태로 롤백
      if (prevStatusRef.current) setPendingStatus(prevStatusRef.current);
      alertMessage(t('require.sheet.false'), { description: String(err) });
      prevStatusRef.current = null;
    },
  });

  const [pendingStatus, setPendingStatus] = useState<StatusKey | null>(null);
  const commitTimerRef = useRef<number | null>(null);
  const prevStatusRef = useRef<StatusKey | null>(null);

  useEffect(() => {
    return () => {
      if (commitTimerRef.current) window.clearTimeout(commitTimerRef.current);
    };
  }, []);

  if (!isValidId) return <EmptyState />;
  if (isLoading) return <Loader />;
  if (isError || !data) return <ErrorState />;

  const effectiveStatus =
    (pendingStatus ?? (data.status as StatusKey)) || 'RECEIVED';
  const labelTuple = STATUS_LABELS[effectiveStatus];
  const badgeText = t(labelTuple?.[0]) ?? t('require.sheet.me');
  const badgeClass = labelTuple?.[1] ?? 'bg-zinc-300 text-black';

  const deleting = deleteMutation.isPending;
  const committing = updateStatusMutation.isPending;
  const canChange = user?.role === 'ADMIN';

  const handleBadge = () => {
    if (!canChange) {
      alertMessage(t('require.sheet.admin'));
      return;
    }

    const current: StatusKey = effectiveStatus;
    const next: StatusKey = nextStatusOf(current);

    // 최초 클릭 시 롤백 포인트 저장
    if (prevStatusRef.current == null) {
      prevStatusRef.current = current;
    }

    setPendingStatus(next);

    if (commitTimerRef.current) {
      window.clearTimeout(commitTimerRef.current);
      commitTimerRef.current = null;
    }

    // 2초간 추가 클릭이 없으면 서버 커밋
    commitTimerRef.current = window.setTimeout(() => {
      updateStatusMutation.mutate({ id: intId, status: STATUS_TO_ENUM[next] });
    }, 2000);
  };

  return (
    <CustomCard
      description={
        !isEdit && (
          <div className="flex justify-between">
            <h1 className="text-2xl font-semibold">{data.title}</h1>

            <div className="flex gap-3 justify-center items-center">
              <span
                role="button"
                onClick={handleBadge}
                className={cn(
                  'text-sm px-3 py-1 rounded-xl select-none',
                  canChange ? 'cursor-pointer' : 'cursor-default',
                  committing ? 'opacity-60 pointer-events-none' : '',
                  badgeClass,
                )}
                title={
                  canChange
                    ? t('require.sheet.click')
                    : t('require.sheet.black')
                }>
                {badgeText}
              </span>
            </div>
          </div>
        )
      }
      content={
        <>
          {!isEdit ? (
            <div>
              <div className="border-b my-3 py-3 space-y-3">
                <p className="text-wrap text-lg">{data.description}</p>
                <div className="text-sm text-gray-500 flex justify-end">
                  <span>
                    {t('require.sheet.date')} {formatDate(data.createdAt)}
                  </span>
                </div>
              </div>
              <div className="flex justify-end">
                <div>
                  <EditBtn
                    onClick={() => setIsEdit(true)}
                    disabled={deleting}
                  />
                  <DeleteBtn onClick={handleDelete} disabled={deleting} />
                </div>
              </div>
            </div>
          ) : (
            <RequireFormField
              setIsOpen={setIsOpen}
              isEdit
              setIsEdit={setIsEdit}
              isValidId={Number(searchParams.get('id'))}
              initial={{
                title: data.title,
                description: data.description,
                requireType: data.requireType,
              }}
            />
          )}
        </>
      }
    />
  );
};

export default RequireDetailPage;
