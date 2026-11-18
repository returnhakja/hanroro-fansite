import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getAuthHeader } from '@/lib/auth/authHeader';

export interface PublicBanner {
  _id: string;
  pcImageUrl: string;
  mobileImageUrl?: string;
  alt: string;
  buttonLabel?: string;
  linkUrl: string;
}

export interface AdminBanner extends PublicBanner {
  title: string;
  startAt?: string | null;
  endAt?: string | null;
  order: number;
  isActive: boolean;
}

export interface BannerFormData {
  title: string;
  pcImageUrl: string;
  mobileImageUrl: string;
  alt: string;
  buttonLabel: string;
  linkUrl: string;
  startDate: string; // YYYY-MM-DD (한국 시간)
  endDate: string;
  order: number;
  isActive: boolean;
}

// ─── 공개 훅 ─────────────────────────────────────────────────────
export function useBanners() {
  return useQuery({
    queryKey: queryKeys.banners.all,
    queryFn: async () => {
      const res = await fetch('/api/banners');
      if (!res.ok) return [] as PublicBanner[];
      const data = await res.json();
      return (data.banners || []) as PublicBanner[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ─── 관리자 훅 ───────────────────────────────────────────────────
async function send(url: string, method: string, body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || '요청에 실패했습니다');
  }
  return res.json();
}

export function useAdminBanners() {
  return useQuery({
    queryKey: queryKeys.banners.admin,
    queryFn: async () => {
      const res = await fetch('/api/admin/banners', { headers: getAuthHeader() });
      if (!res.ok) throw new Error('배너 목록을 불러올 수 없습니다');
      const data = await res.json();
      return (data.banners || []) as AdminBanner[];
    },
  });
}

function useInvalidate() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.banners.admin });
    queryClient.invalidateQueries({ queryKey: queryKeys.banners.all });
  };
}

export function useSaveBanner() {
  const onSuccess = useInvalidate();
  return useMutation({
    mutationFn: ({ id, formData }: { id?: string; formData: BannerFormData }) =>
      id
        ? send(`/api/admin/banners/${id}`, 'PUT', formData)
        : send('/api/admin/banners', 'POST', formData),
    onSuccess,
  });
}

export function useDeleteBanner() {
  const onSuccess = useInvalidate();
  return useMutation({
    mutationFn: (id: string) => send(`/api/admin/banners/${id}`, 'DELETE'),
    onSuccess,
  });
}
