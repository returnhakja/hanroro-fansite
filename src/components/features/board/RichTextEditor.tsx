"use client";

import { EditorContent, useEditor, Node, mergeAttributes } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import { upload } from "@vercel/blob/client";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

// 커스텀 동영상 노드
const VideoExtension = Node.create({
  name: "video",
  group: "block",
  atom: true,
  addAttributes() {
    return { src: { default: null } };
  },
  parseHTML() {
    return [{ tag: "video[src]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      mergeAttributes(HTMLAttributes, {
        controls: true,
        style: "max-width:100%; border-radius:6px; margin:0.5rem 0;",
      }),
    ];
  },
});

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "내용을 입력하세요...",
  minHeight = "300px",
}: RichTextEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const isUpdatingRef = useRef(false);

  // 공통 업로드 함수 (Vercel Blob 클라이언트 직접 업로드)
  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    try {
      const timestamp = Date.now();
      const sanitized = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const pathname = `board/${timestamp}-${sanitized}`;
      const blob = await upload(pathname, file, {
        access: "public",
        handleUploadUrl: "/api/upload?type=board",
      });
      return blob.url;
    } catch {
      return null;
    }
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: false }),
      VideoExtension,
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      if (!isUpdatingRef.current) {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;

        for (const item of Array.from(items)) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (!file) continue;
            event.preventDefault();
            uploadFile(file).then((url) => {
              if (url) {
                view.dispatch(
                  view.state.tr.replaceSelectionWith(
                    view.state.schema.nodes.image.create({ src: url })
                  )
                );
              }
            });
            return true;
          }
        }
        return false;
      },
      handleDrop: (view, event) => {
        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) return false;

        const mediaFiles = Array.from(files).filter(
          (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
        );
        if (mediaFiles.length === 0) return false;

        event.preventDefault();
        mediaFiles.forEach((file) => {
          uploadFile(file).then((url) => {
            if (!url) return;
            const { schema, tr, selection } = view.state;
            if (file.type.startsWith("video/")) {
              view.dispatch(
                tr.insert(
                  selection.from,
                  schema.nodes.video.create({ src: url })
                )
              );
            } else {
              view.dispatch(
                tr.insert(
                  selection.from,
                  schema.nodes.image.create({ src: url })
                )
              );
            }
          });
        });
        return true;
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const currentHTML = editor.getHTML();
    if (value !== currentHTML && value !== undefined) {
      isUpdatingRef.current = true;
      editor.commands.setContent(value || "", { emitUpdate: false });
      isUpdatingRef.current = false;
    }
  }, [value, editor]);

  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    const url = await uploadFile(file);
    if (url) editor.chain().focus().setImage({ src: url }).run();
    e.target.value = "";
  };

  const handleVideoFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    const url = await uploadFile(file);
    if (url) {
      editor.chain().focus().insertContent({ type: "video", attrs: { src: url } }).run();
    }
    e.target.value = "";
  };

  if (!editor) return null;

  return (
    <EditorContainer>
      <Toolbar>
        <ToolbarGroup>
          <ToolbarButton
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            $active={editor.isActive("bold")}
            title="굵게 (Ctrl+B)"
          >
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            $active={editor.isActive("italic")}
            title="기울임 (Ctrl+I)"
          >
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            $active={editor.isActive("strike")}
            title="취소선"
          >
            <s>S</s>
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        <ToolbarGroup>
          <ToolbarButton
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            $active={editor.isActive("heading", { level: 2 })}
            title="제목 2"
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            $active={editor.isActive("heading", { level: 3 })}
            title="제목 3"
          >
            H3
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        <ToolbarGroup>
          <ToolbarButton
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            $active={editor.isActive("bulletList")}
            title="목록"
          >
            ≡
          </ToolbarButton>
          <ToolbarButton
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            $active={editor.isActive("blockquote")}
            title="인용구"
          >
            ❝
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        <MediaButtonGroup>
          <MediaUploadButton
            type="button"
            onClick={() => imageInputRef.current?.click()}
            title="이미지 삽입"
          >
            🖼 이미지
          </MediaUploadButton>
          <MediaUploadButton
            type="button"
            onClick={() => videoInputRef.current?.click()}
            title="동영상 삽입"
          >
            🎬 동영상
          </MediaUploadButton>
        </MediaButtonGroup>
      </Toolbar>

      <EditorContentWrapper $minHeight={minHeight}>
        <EditorContent editor={editor} />
      </EditorContentWrapper>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageFileSelect}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        style={{ display: "none" }}
        onChange={handleVideoFileSelect}
      />
    </EditorContainer>
  );
}

const EditorContainer = styled.div`
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  background: ${theme.colors.surface};
  overflow: hidden;
  transition: border-color ${theme.transitions.fast};

  &:focus-within {
    border-color: ${theme.colors.accent};
  }
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid ${theme.colors.border};
  background: ${theme.colors.surfaceAlt};
  flex-wrap: wrap;
`;

const ToolbarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.125rem;
`;

const ToolbarDivider = styled.div`
  width: 1px;
  height: 20px;
  background: ${theme.colors.border};
  margin: 0 0.25rem;
`;

const ToolbarButton = styled.button<{ $active?: boolean }>`
  padding: 0.25rem 0.5rem;
  min-width: 30px;
  height: 30px;
  background: ${({ $active }) => ($active ? theme.colors.accent : "transparent")};
  color: ${({ $active }) => ($active ? theme.colors.textLight : theme.colors.textSecondary)};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  font-family: ${theme.typography.fontBody};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${({ $active }) => ($active ? theme.colors.accentDark : theme.colors.surfaceWarm)};
  }
`;

const MediaButtonGroup = styled.div`
  display: flex;
  gap: 0.375rem;
  margin-left: auto;
`;

const MediaUploadButton = styled.button`
  padding: 0.25rem 0.625rem;
  height: 30px;
  background: transparent;
  color: ${theme.colors.primary};
  border: 1px solid ${theme.colors.primary};
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  font-family: ${theme.typography.fontBody};
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.primary};
    color: ${theme.colors.textLight};
  }
`;

const EditorContentWrapper = styled.div<{ $minHeight: string }>`
  .ProseMirror {
    min-height: ${({ $minHeight }) => $minHeight};
    padding: 1rem;
    outline: none;
    font-family: ${theme.typography.fontBody};
    font-size: 1rem;
    line-height: 1.75;
    color: ${theme.colors.textPrimary};

    p { margin: 0.5rem 0; }

    h2 {
      font-family: ${theme.typography.fontHeading};
      font-size: 1.5rem;
      font-weight: 500;
      color: ${theme.colors.textPrimary};
      margin: 1.5rem 0 0.5rem;
      line-height: 1.3;
    }

    h3 {
      font-family: ${theme.typography.fontHeading};
      font-size: 1.2rem;
      font-weight: 500;
      color: ${theme.colors.textPrimary};
      margin: 1.25rem 0 0.5rem;
      line-height: 1.3;
    }

    strong { font-weight: 600; }
    em { font-style: italic; }
    s { text-decoration: line-through; color: ${theme.colors.textTertiary}; }

    blockquote {
      border-left: 3px solid ${theme.colors.accent};
      padding-left: 1rem;
      margin: 1rem 0;
      color: ${theme.colors.textSecondary};
      font-style: italic;
    }

    ul {
      padding-left: 1.5rem;
      margin: 0.5rem 0;
      li { margin: 0.25rem 0; }
    }

    img {
      max-width: 100%;
      height: auto;
      border-radius: ${theme.borderRadius.sm};
      margin: 0.5rem 0;
      display: block;
    }

    video {
      max-width: 100%;
      border-radius: ${theme.borderRadius.sm};
      margin: 0.5rem 0;
      display: block;
    }

    p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      color: ${theme.colors.textTertiary};
      pointer-events: none;
      float: left;
      height: 0;
    }
  }
`;
