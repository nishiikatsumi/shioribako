'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

type Props = {
  onChange?: (html: string) => void
  initialContent?: string
}

export default function TiptapEditor({ onChange, initialContent = '' }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'min-h-52 outline-none text-sm text-foreground prose prose-sm max-w-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-xl font-bold text-center text-foreground mb-4">ブログ投稿欄</h2>

      {/* ツールバー */}
      <div className="flex flex-wrap gap-1 mb-3 border-b border-border pb-3">
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBold().run()}
          isActive={editor?.isActive('bold') ?? false}
          label="B"
          title="太字"
          className="font-bold"
        />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          isActive={editor?.isActive('italic') ?? false}
          label="I"
          title="斜体"
          className="italic"
        />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          isActive={editor?.isActive('strike') ?? false}
          label="S"
          title="取り消し線"
          className="line-through"
        />
        <div className="w-px bg-border mx-1" />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor?.isActive('heading', { level: 1 }) ?? false}
          label="H1"
          title="見出し1"
        />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor?.isActive('heading', { level: 2 }) ?? false}
          label="H2"
          title="見出し2"
        />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor?.isActive('heading', { level: 3 }) ?? false}
          label="H3"
          title="見出し3"
        />
        <div className="w-px bg-border mx-1" />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          isActive={editor?.isActive('bulletList') ?? false}
          label="• リスト"
          title="箇条書き"
        />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          isActive={editor?.isActive('orderedList') ?? false}
          label="1. リスト"
          title="番号付きリスト"
        />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          isActive={editor?.isActive('blockquote') ?? false}
          label="❝"
          title="引用"
        />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          isActive={editor?.isActive('codeBlock') ?? false}
          label="</>"
          title="コードブロック"
          className="font-mono"
        />
        <div className="w-px bg-border mx-1" />
        <ToolbarButton
          onClick={() => editor?.chain().focus().undo().run()}
          isActive={false}
          label="↩"
          title="元に戻す"
        />
        <ToolbarButton
          onClick={() => editor?.chain().focus().redo().run()}
          isActive={false}
          label="↪"
          title="やり直し"
        />
      </div>

      {/* エディタ本体 */}
      <EditorContent editor={editor} />
    </section>
  )
}

type ToolbarButtonProps = {
  onClick: () => void
  isActive: boolean
  label: string
  title: string
  className?: string
}

function ToolbarButton({ onClick, isActive, label, title, className = '' }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`px-2 py-1 rounded text-sm transition-colors ${className} ${
        isActive
          ? 'bg-accent text-white'
          : 'bg-gray-100 text-foreground hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  )
}
