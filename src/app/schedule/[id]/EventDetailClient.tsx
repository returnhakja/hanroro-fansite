"use client";

import { useRef, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Spinner from "@/components/ui/Spinner";
import { EventTicketOutlets } from "@/components/ui/EventTicketOutlets";
import KakaoShareButton from "@/components/ui/KakaoShareButton";
import { useEvent } from "@/hooks/queries/useEvents";
import {
  useAttendedConcerts,
  useToggleAttendedConcert,
} from "@/hooks/queries/useAttendedConcerts";
import {
  useEventReviews,
  useCreateEventReview,
  useDeleteEventReview,
} from "@/hooks/queries/useEventReviews";
import { uploadToR2 } from "@/lib/storage/uploadClient";
import { buildIcs, downloadIcs } from "@/lib/utils/ics";
import { formatRelativeTime } from "@/lib/utils/time";
import { getEventTypeLabel } from "@/lib/utils/eventSchema";
import {
  Container,
  BackLink,
  Hero,
  HeroDday,
  HeroBody,
  TypeBadge,
  HeroTitle,
  MetaList,
  MetaRow,
  Actions,
  ActionButton,
  SectionTitle,
  ReviewForm,
  ReviewFormRow,
  ReviewInput,
  ReviewTextarea,
  ImageAttachRow,
  ImageThumb,
  ImageRemoveButton,
  ImageAddButton,
  ReviewFormFooter,
  SubmitButton,
  ReviewList,
  ReviewCard,
  ReviewTop,
  ReviewAuthor,
  ReviewTime,
  ReviewDeleteButton,
  ReviewBody,
  ReviewImages,
  ReviewImage,
  ReviewEmpty,
  LoadingText,
} from "./EventDetail.styles";

const MAX_IMAGES = 4;

const IconBack = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M15 18 9 12l6-6" />
  </svg>
);
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IconHeart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
  </svg>
);
const IconCalendarPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M8 2v4M16 2v4M3 10h18" />
    <path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7" />
    <path d="M16 19h6M19 16v6" />
  </svg>
);
const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

function calcDaysUntil(iso: string): number {
  const today = new Date();
  const target = new Date(iso);
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function EventDetailClient({ eventId }: { eventId: string }) {
  const { data: session } = useSession();
  const { data: event, isLoading } = useEvent(eventId);

  const { data: attended = [] } = useAttendedConcerts();
  const { check, uncheck } = useToggleAttendedConcert();

  const { data: reviews = [], isLoading: reviewsLoading } = useEventReviews(eventId);
  const createReview = useCreateEventReview(eventId);
  const deleteReview = useDeleteEventReview(eventId);

  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewPassword, setReviewPassword] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isLoading) {
    return (
      <Container>
        <LoadingText>로딩 중...</LoadingText>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container>
        <BackLink href="/schedule">
          <IconBack />
          일정으로
        </BackLink>
        <LoadingText>일정을 찾을 수 없습니다</LoadingText>
      </Container>
    );
  }

  const isAnonymous = !session?.user;
  const isChecked = attended.some(
    (a) => a.sourceType === "event" && a.sourceId === eventId,
  );
  const isPast = new Date(event.date) < new Date();
  const dday = !isPast ? calcDaysUntil(event.date) : null;

  const handleToggleAttend = () => {
    if (!session?.user) {
      signIn("google");
      return;
    }
    if (isChecked) {
      uncheck.mutate({ sourceType: "event", sourceId: eventId });
    } else {
      check.mutate({
        sourceType: "event",
        sourceId: eventId,
        title: event.title,
        venue: event.place,
        date: event.date,
      });
    }
  };

  const handleAddToCalendar = () => {
    const ics = buildIcs({
      title: `[한로로] ${event.title}`,
      date: event.date,
      time: event.time,
      place: event.place,
      description: [
        getEventTypeLabel(event.type),
        event.place,
        event.ticketOutlets?.map((t) => `${t.label}: ${t.url}`).join(" / "),
      ]
        .filter(Boolean)
        .join("\n"),
      url:
        typeof window !== "undefined"
          ? `${window.location.origin}/schedule/${eventId}`
          : undefined,
    });
    const safeTitle = event.title.replace(/[^\w가-힣]+/g, "_").slice(0, 40);
    downloadIcs(ics, `hanroro_${safeTitle}.ics`);
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length === 0) return;

    const remaining = MAX_IMAGES - imageUrls.length;
    const toUpload = files.slice(0, remaining);

    setUploading(true);
    try {
      const uploaded = await Promise.all(
        toUpload.map(async (file) => {
          try {
            return await uploadToR2(file, { type: "review" });
          } catch (err) {
            alert(err instanceof Error ? err.message : "이미지 업로드에 실패했습니다");
            return null;
          }
        }),
      );
      setImageUrls((prev) => [...prev, ...uploaded.filter((u): u is string => !!u)]);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (url: string) => {
    setImageUrls((prev) => prev.filter((u) => u !== url));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewContent.trim()) {
      alert("후기 내용을 입력해주세요");
      return;
    }
    if (isAnonymous && !reviewAuthor.trim()) {
      alert("닉네임을 입력해주세요");
      return;
    }
    if (isAnonymous && reviewPassword.length < 4) {
      alert("비밀번호를 4자 이상 입력해주세요");
      return;
    }

    const author = isAnonymous
      ? reviewAuthor.trim()
      : session?.user?.nickname || session?.user?.name || "익명";

    createReview.mutate(
      {
        author,
        content: reviewContent.trim(),
        password: isAnonymous ? reviewPassword : undefined,
        imageUrls,
      },
      {
        onSuccess: () => {
          setReviewContent("");
          setReviewPassword("");
          setImageUrls([]);
        },
        onError: (err) => {
          alert(err instanceof Error ? err.message : "후기 작성에 실패했습니다");
        },
      },
    );
  };

  const handleDeleteReview = (reviewId: string, hasUserId: boolean) => {
    if (!confirm("이 후기를 삭제하시겠습니까?")) return;

    let password: string | undefined;
    if (!hasUserId) {
      const input = window.prompt("작성 시 입력한 비밀번호를 입력하세요");
      if (input === null) return;
      password = input;
    }

    deleteReview.mutate(
      { reviewId, password },
      {
        onError: (err) => {
          alert(err instanceof Error ? err.message : "삭제에 실패했습니다");
        },
      },
    );
  };

  return (
    <Container>
      <BackLink href="/schedule">
        <IconBack />
        일정으로
      </BackLink>

      <Hero $posterUrl={event.posterUrl}>
        {dday !== null && <HeroDday>{dday === 0 ? "D-DAY" : `D-${dday}`}</HeroDday>}
        <HeroBody>
          <TypeBadge>{getEventTypeLabel(event.type)}</TypeBadge>
          <HeroTitle>{event.title}</HeroTitle>
        </HeroBody>
      </Hero>

      <MetaList>
        <MetaRow>
          <IconCalendar />
          <strong>
            {new Date(event.date).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "short",
            })}
          </strong>
          {event.time && <>&nbsp;· {event.time}</>}
        </MetaRow>
        {event.place && (
          <MetaRow>
            <IconPin />
            {event.place}
          </MetaRow>
        )}
      </MetaList>

      <Actions>
        <ActionButton type="button" $checked={isChecked} onClick={handleToggleAttend}>
          <IconHeart />
          {isChecked ? (isPast ? "다녀왔어요" : "체크됨") : isPast ? "다녀왔어요 체크" : "내 공연 체크"}
        </ActionButton>
        <ActionButton type="button" onClick={handleAddToCalendar}>
          <IconCalendarPlus />
          캘린더 추가
        </ActionButton>
        <KakaoShareButton
          title={`[한로로] ${event.title}`}
          description={[
            new Date(event.date).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "short",
            }),
            event.place,
            event.time,
          ]
            .filter(Boolean)
            .join("\n")}
          imageUrl={event.posterUrl}
          path={`/schedule/${eventId}`}
          buttonTitle="일정 보기"
        />
      </Actions>

      {!isPast && event.ticketOutlets && event.ticketOutlets.length > 0 && (
        <EventTicketOutlets outlets={event.ticketOutlets} idPrefix={eventId} />
      )}

      <SectionTitle>
        <h2>공연 후기</h2>
        {reviews.length > 0 && <span>{reviews.length}개</span>}
      </SectionTitle>

      {isPast ? (
        <>
          <ReviewForm onSubmit={handleSubmitReview}>
            <ReviewFormRow>
              <ReviewInput
                type="text"
                placeholder="닉네임"
                value={isAnonymous ? reviewAuthor : session?.user?.nickname || session?.user?.name || ""}
                onChange={(e) => setReviewAuthor(e.target.value)}
                readOnly={!isAnonymous}
                maxLength={50}
              />
              {isAnonymous && (
                <ReviewInput
                  type="password"
                  placeholder="비밀번호 (4자 이상)"
                  value={reviewPassword}
                  onChange={(e) => setReviewPassword(e.target.value)}
                />
              )}
            </ReviewFormRow>
            <ReviewTextarea
              placeholder="이 공연은 어떠셨나요?"
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              maxLength={1000}
            />
            <ImageAttachRow>
              {imageUrls.map((url) => (
                <ImageThumb key={url}>
                  <img src={url} alt="첨부 이미지" />
                  <ImageRemoveButton type="button" onClick={() => handleRemoveImage(url)} aria-label="이미지 삭제">
                    <IconClose />
                  </ImageRemoveButton>
                </ImageThumb>
              ))}
              {imageUrls.length < MAX_IMAGES && (
                <ImageAddButton
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  aria-label="이미지 첨부"
                >
                  <IconPlus />
                </ImageAddButton>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={handleImageSelect}
              />
            </ImageAttachRow>
            <ReviewFormFooter>
              <SubmitButton type="submit" disabled={createReview.isPending || uploading}>
                {uploading ? "이미지 업로드 중..." : createReview.isPending ? "등록 중..." : "후기 남기기"}
              </SubmitButton>
            </ReviewFormFooter>
          </ReviewForm>

          {reviewsLoading ? (
            <Spinner />
          ) : reviews.length === 0 ? (
            <ReviewEmpty>아직 후기가 없어요. 첫 후기를 남겨보세요!</ReviewEmpty>
          ) : (
            <ReviewList>
              {reviews.map((review) => (
                <ReviewCard key={review._id}>
                  <ReviewTop>
                    <ReviewAuthor>{review.author}</ReviewAuthor>
                    <ReviewTime>{formatRelativeTime(review.createdAt)}</ReviewTime>
                    <ReviewDeleteButton
                      type="button"
                      onClick={() => handleDeleteReview(review._id, !!review.userId)}
                    >
                      삭제
                    </ReviewDeleteButton>
                  </ReviewTop>
                  <ReviewBody>{review.content}</ReviewBody>
                  {review.imageUrls.length > 0 && (
                    <ReviewImages>
                      {review.imageUrls.map((url) => (
                        <ReviewImage
                          key={url}
                          src={url}
                          alt="후기 첨부 이미지"
                          onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
                        />
                      ))}
                    </ReviewImages>
                  )}
                </ReviewCard>
              ))}
            </ReviewList>
          )}
        </>
      ) : (
        <ReviewEmpty>
          공연이 끝나면 이곳에서 후기를 남길 수 있어요.
          <br />
          공연 다녀오시면 꼭 들러서 소감 남겨주세요!
        </ReviewEmpty>
      )}
    </Container>
  );
}
