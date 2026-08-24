'use client';

import KakaoShareButton from '@/components/ui/KakaoShareButton';
import { useFavoriteSetlist } from '@/hooks/queries/useFavoriteSetlist';
import Spinner from '@/components/ui/Spinner';
import {
  Container,
  BackLink,
  ShareWrap,
  Poster,
  PosterBrand,
  PosterTitle,
  PosterList,
  PosterRow,
  PosterFoot,
  ShareActions,
  Note,
  PillLink,
  MakeMineLink,
  LoadingText,
} from './Result.styles';

const IconBack = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

export default function ResultClient({ id }: { id: string }) {
  const { data: setlist, isLoading } = useFavoriteSetlist(id);

  if (isLoading) {
    return <Spinner />;
  }

  if (!setlist) {
    return (
      <Container>
        <BackLink href="/setlist">
          <IconBack />
          셋리스트로
        </BackLink>
        <LoadingText>세트리스트를 찾을 수 없습니다</LoadingText>
      </Container>
    );
  }

  const imageUrl = `/setlist/builder/${id}/opengraph-image`;
  const description = setlist.songs.slice(0, 3).join(' · ') + (setlist.songs.length > 3 ? ' 외' : '');

  return (
    <Container>
      <BackLink href="/setlist">
        <IconBack />
        셋리스트로
      </BackLink>

      <ShareWrap>
        <Poster>
          <PosterBrand>H A N R O R O</PosterBrand>
          <PosterTitle>
            나의 최애
            <br />
            세트리스트
          </PosterTitle>
          <PosterList>
            {setlist.songs.map((title, index) => (
              <PosterRow key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {title}
              </PosterRow>
            ))}
          </PosterList>
          <PosterFoot>HANRORO.CO.KR</PosterFoot>
        </Poster>

        <ShareActions>
          <Note>이 카드를 저장하거나 링크로 공유해보세요. 로그인하면 마이페이지에서 다시 볼 수 있어요.</Note>
          <PillLink href={imageUrl} download="hanroro-my-setlist.png">
            ⬇ 이미지 저장
          </PillLink>
          <KakaoShareButton
            title="내 최애 세트리스트"
            description={description}
            imageUrl={imageUrl}
            path={`/setlist/builder/${id}`}
            buttonTitle="세트리스트 보기"
            label="카카오톡 공유"
            size="lg"
          />
          <MakeMineLink href="/setlist/builder">나도 만들어보기</MakeMineLink>
        </ShareActions>
      </ShareWrap>
    </Container>
  );
}
