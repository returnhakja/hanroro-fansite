import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getBoardById,
  updateBoard,
  uploadBoardImages,
  type BoardPayload,
} from "../api/api";
import { ConfirmModal } from "../components/ConfirmModal";
import { ImageUploadSection } from "../components/ImageUploadSection";
import { useToast } from "../components/ToastContext";
import { useFormValidation } from "../hooks/useFormValidation";
import { useImageUpload } from "../hooks/useImageUpload";
import {
  ActionButton,
  Actions,
  Counter,
  ErrorText,
  Field,
  FormCard,
  HeaderRow,
  Input,
  Label,
  LabelRow,
  PageWrapper,
  Textarea,
  Title,
} from "./BoardWrite.styles";

type Post = BoardPayload & { imageUrls?: string[] };

interface FormValues {
  title: string;
  content: string;
  author: string;
}

const validationRules = {
  title: (value: string) =>
    !value.trim() ? "제목을 입력해 주세요." : undefined,
  content: (value: string) =>
    !value.trim() ? "내용을 입력해 주세요." : undefined,
  author: (value: string) =>
    !value.trim() ? "작성자를 입력해 주세요." : undefined,
};

export const BoardEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { errors, validate } = useFormValidation<FormValues>(validationRules);
  const imageUpload = useImageUpload();

  // 게시글 불러오기
  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;
      try {
        const post = (await getBoardById(id)) as Post;
        setTitle(post.title ?? "");
        setContent(post.content ?? "");
        setAuthor(post.author ?? "");
        imageUpload.setExistingUrls(post.imageUrls ?? []);
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
        showToast("게시글을 불러오지 못했어요.", "error");
        navigate("/board");
      }
    };
    void loadPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate, showToast]);

  // Textarea 자동 높이 조절
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validate({ title, content, author });
    if (!isValid || !id) {
      showToast("필수 항목을 확인해 주세요.", "error");
      return;
    }

    setSubmitting(true);
    try {
      let uploadedUrls: string[] = [];

      // 새 이미지 업로드
      if (imageUpload.newImages.length > 0) {
        const formData = new FormData();
        imageUpload.newImages.forEach((img) => formData.append("images", img));
        const res = await uploadBoardImages(formData);
        uploadedUrls = res.imageUrls;
      }

      // 게시글 수정
      await updateBoard(id, {
        title: title.trim(),
        content: content.trim(),
        author: author.trim(),
        imageUrls: imageUpload.getAllImageUrls(uploadedUrls),
      });

      showToast("게시글이 수정되었습니다.", "success");
      navigate(`/board/${id}`);
    } catch (err) {
      console.error("게시글 수정 실패:", err);
      showToast("게시글 수정에 실패했습니다.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const hasUnsavedChanges =
    title || content || author || imageUpload.newImages.length > 0;

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowCancelConfirm(true);
    } else if (id) {
      navigate(`/board/${id}`);
    } else {
      navigate("/board");
    }
  };

  const handleConfirmCancel = () => {
    if (id) {
      navigate(`/board/${id}`);
    } else {
      navigate("/board");
    }
  };

  return (
    <PageWrapper>
      <FormCard>
        <HeaderRow>
          <Title>게시글 수정</Title>
          <Actions>
            <ActionButton
              type="button"
              $variant="ghost"
              onClick={handleCancel}
              disabled={submitting}
            >
              취소
            </ActionButton>
            <ActionButton
              type="submit"
              form="board-edit-form"
              $variant="primary"
              disabled={submitting}
            >
              {submitting ? "수정 중..." : "수정"}
            </ActionButton>
          </Actions>
        </HeaderRow>

        <form id="board-edit-form" onSubmit={handleSubmit}>
          <Field>
            <LabelRow>
              <Label>제목</Label>
              <Counter>{title.length}/60</Counter>
            </LabelRow>
            <Input
              type="text"
              value={title}
              maxLength={60}
              placeholder="제목을 입력해 주세요."
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <ErrorText>{errors.title}</ErrorText>}
          </Field>

          <Field>
            <LabelRow>
              <Label>내용</Label>
              <Counter>{content.length}자</Counter>
            </LabelRow>
            <Textarea
              ref={textareaRef}
              value={content}
              rows={6}
              placeholder="내용을 입력해 주세요."
              onChange={(e) => setContent(e.target.value)}
              onInput={() => {
                if (!textareaRef.current) return;
                textareaRef.current.style.height = "auto";
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
              }}
            />
            {errors.content && <ErrorText>{errors.content}</ErrorText>}
          </Field>

          <Field>
            <LabelRow>
              <Label>작성자</Label>
              <Counter>{author.length}/10</Counter>
            </LabelRow>
            <Input
              type="text"
              value={author}
              maxLength={10}
              placeholder="닉네임을 입력해 주세요."
              onChange={(e) => setAuthor(e.target.value)}
            />
            {errors.author && <ErrorText>{errors.author}</ErrorText>}
          </Field>

          <ImageUploadSection
            existingUrls={imageUpload.existingUrls}
            previews={imageUpload.previews}
            dragging={imageUpload.dragging}
            onDragStart={() => imageUpload.setDragging(true)}
            onDragEnd={() => imageUpload.setDragging(false)}
            onDrop={imageUpload.addFiles}
            onFileSelect={imageUpload.addFiles}
            onRemoveExisting={imageUpload.removeExistingImage}
            onRemoveNew={imageUpload.removeNewImage}
          />
        </form>

        <ConfirmModal
          isOpen={showCancelConfirm}
          title="수정 취소"
          description="수정 중인 내용이 사라집니다. 취소할까요?"
          confirmLabel="나가기"
          onCancel={() => setShowCancelConfirm(false)}
          onConfirm={handleConfirmCancel}
        />
      </FormCard>
    </PageWrapper>
  );
};
