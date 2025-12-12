import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getBoardById,
  updateBoard,
  uploadBoardImages,
  type BoardPayload,
} from "../api/api";
import { ConfirmModal } from "../components/ConfirmModal";
import { useToast } from "../components/ToastContext";
import {
  ActionButton,
  Actions,
  Counter,
  DropZone,
  ErrorText,
  Field,
  FormCard,
  HeaderRow,
  Input,
  Label,
  LabelRow,
  PageWrapper,
  RemoveThumb,
  Textarea,
  ThumbGrid,
  ThumbItem,
  Title,
} from "./BoardWrite.styles";

type Post = BoardPayload & { imageUrls?: string[] };

export const BoardEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [existingUrls, setExistingUrls] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    author?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const post = (await getBoardById(id)) as Post;
        setTitle(post.title ?? "");
        setContent(post.content ?? "");
        setAuthor(post.author ?? "");
        setExistingUrls(post.imageUrls ?? []);
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
        showToast("게시글을 불러오지 못했어요.", "error");
        navigate("/board");
      }
    };
    void load();
  }, [id, navigate, showToast]);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [content]);

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [images]);

  const addFiles = (files: FileList | File[]) => {
    const next = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (next.length === 0) return;
    setImages((prev) => [...prev, ...next]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const validate = () => {
    const next: typeof errors = {};
    if (!title.trim()) next.title = "제목을 입력해 주세요.";
    if (!content.trim()) next.content = "내용을 입력해 주세요.";
    if (!author.trim()) next.author = "작성자를 입력해 주세요.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !id) {
      showToast("필수 항목을 확인해 주세요.", "error");
      return;
    }

    setSubmitting(true);
    try {
      let newUrls: string[] = [];
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((img) => formData.append("images", img));
        const res = await uploadBoardImages(formData);
        newUrls = res.imageUrls;
      }

      const imageUrls = [...existingUrls, ...newUrls];
      await updateBoard(id, {
        title: title.trim(),
        content: content.trim(),
        author: author.trim(),
        imageUrls,
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

  const handleCancel = () => {
    if (title || content || author || images.length > 0) {
      setShowCancelConfirm(true);
    } else if (id) {
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

          <Field>
            <Label>사진 첨부 (선택)</Label>
            <DropZone
              $dragging={dragging}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              클릭하거나 이미지를 끌어다 놓으세요.
              <br />
              여러 장 첨부할 수 있어요.
            </DropZone>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            {(existingUrls.length > 0 || previews.length > 0) && (
              <ThumbGrid>
                {existingUrls.map((url, idx) => (
                  <ThumbItem key={`existing-${url}-${idx}`}>
                    <img src={url} alt="기존 첨부 이미지" />
                    <RemoveThumb
                      type="button"
                      onClick={() =>
                        setExistingUrls((prev) =>
                          prev.filter((_, i) => i !== idx)
                        )
                      }
                    >
                      ×
                    </RemoveThumb>
                  </ThumbItem>
                ))}
                {previews.map((url, idx) => (
                  <ThumbItem key={`new-${url}-${idx}`}>
                    <img src={url} alt="새 첨부 이미지" />
                    <RemoveThumb
                      type="button"
                      onClick={() =>
                        setImages((prev) =>
                          prev.filter((_, i) => i !== idx)
                        )
                      }
                    >
                      ×
                    </RemoveThumb>
                  </ThumbItem>
                ))}
              </ThumbGrid>
            )}
          </Field>
        </form>

        <ConfirmModal
          isOpen={showCancelConfirm}
          title="수정 취소"
          description="수정 중인 내용이 사라집니다. 취소할까요?"
          confirmLabel="나가기"
          onCancel={() => setShowCancelConfirm(false)}
          onConfirm={() => (id ? navigate(`/board/${id}`) : navigate("/board"))}
        />
      </FormCard>
    </PageWrapper>
  );
};

