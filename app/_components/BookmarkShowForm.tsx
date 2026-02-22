'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import CategoryManagerDialog from './CategoryManagerDialog'
import TagManagerDialog from './TagManagerDialog'

// ─── 型定義（各ページから import できるよう export） ────────────────────────
export type Category = {
  id: string
  name: string
}

export type Tag = {
  id: string
  name: string
}

export type Bookmark = {
  id: string
  url: string
  comment: string | null
  isFavorite: boolean
  publishStatus: string
  createdAt: string
  user: {
    userName: string
  }
  postCategories: { category: Category }[]
  postTags: { tag: Tag }[]
}

// ─── ステータスラベル定数 ────────────────────────────────────────────────────
const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  PUBLISHED: { label: '公開',   className: 'bg-green-100 text-green-700'   },
  DRAFT:     { label: '下書き', className: 'bg-gray-100 text-gray-500'     },
  PRIVATE:   { label: '非公開', className: 'bg-yellow-100 text-yellow-700' },
}

// ─── Props ──────────────────────────────────────────────────────────────────
interface BookmarkShowFormProps {
  bookmarks: Bookmark[]
  isLoading: boolean
  /** true のとき 公開ステータスバッジ + ⭐ を表示（マイブックマーク用） */
  showStatusBadge?: boolean
  pageTitle?: string
  newBookmarkHref?: string
}

// ─── メインコンポーネント ────────────────────────────────────────────────────
export default function BookmarkShowForm({
  bookmarks,
  isLoading,
  showStatusBadge = false,
  pageTitle = 'ブックマーク一覧',
  newBookmarkHref = '/bookmarks/new',
}: BookmarkShowFormProps) {
  const [selectedCategory, setSelectedCategory] = useState('')
  // タグは複数選択対応
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false)

  // 全カテゴリー・タグを重複なく抽出
  const allCategories = useMemo(() => {
    const map = new Map<string, Category>()
    bookmarks.forEach((bm) =>
      bm.postCategories.forEach(({ category }) => map.set(category.id, category))
    )
    return Array.from(map.values())
  }, [bookmarks])

  const allTags = useMemo(() => {
    const map = new Map<string, Tag>()
    bookmarks.forEach((bm) =>
      bm.postTags.forEach(({ tag }) => map.set(tag.id, tag))
    )
    return Array.from(map.values())
  }, [bookmarks])

  // フィルタリング（タグは OR 条件: 選択タグのどれかに一致）
  const filtered = useMemo(() => {
    return bookmarks.filter((bm) => {
      const matchCategory =
        selectedCategory === '' ||
        bm.postCategories.some((pc) => pc.category.id === selectedCategory)
      const matchTag =
        selectedTags.length === 0 ||
        bm.postTags.some((pt) => selectedTags.includes(pt.tag.id))
      return matchCategory && matchTag
    })
  }, [bookmarks, selectedCategory, selectedTags])

  // 現在選択中のカテゴリー名
  const selectedCategoryName = selectedCategory
    ? allCategories.find((c) => c.id === selectedCategory)?.name
    : null

  // タグボタンのラベル
  const tagButtonLabel = selectedTags.length > 0
    ? `タグ (${selectedTags.length})`
    : 'タグ'

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-2xl px-6 py-10">

        {/* タイトル */}
        <h1 className="text-center text-2xl font-bold text-foreground mb-4">
          {pageTitle}
        </h1>

        {/* 新規追加ボタン */}
        <div className="flex justify-center mb-6">
          <Link
            href={newBookmarkHref}
            className="inline-block rounded bg-accent px-8 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity"
          >
            ブックマーク新規追加
          </Link>
        </div>

        {/* フィルター */}
        <div className="flex items-center gap-3 mb-8">

          {/* カテゴリー（クリックで管理ダイアログを開く） */}
          <button
            type="button"
            onClick={() => setIsCategoryDialogOpen(true)}
            className={`flex items-center gap-1.5 rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-gray-50 ${
              selectedCategoryName
                ? 'border-accent text-accent bg-accent/5'
                : 'border-border text-foreground'
            }`}
          >
            {selectedCategoryName ?? 'カテゴリー'}
            <span className="text-xs opacity-60">▼</span>
          </button>

          {/* タグ（クリックで管理ダイアログを開く） */}
          <button
            type="button"
            onClick={() => setIsTagDialogOpen(true)}
            className={`flex items-center gap-1.5 rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-gray-50 ${
              selectedTags.length > 0
                ? 'border-accent text-accent bg-accent/5'
                : 'border-border text-foreground'
            }`}
          >
            {tagButtonLabel}
            <span className="text-xs opacity-60">▼</span>
          </button>

          {/* 絞り込みリセット（どちらか選択中のときのみ表示） */}
          {(selectedCategory || selectedTags.length > 0) && (
            <button
              type="button"
              onClick={() => { setSelectedCategory(''); setSelectedTags([]) }}
              className="text-xs text-muted hover:text-foreground transition-colors"
            >
              リセット
            </button>
          )}

        </div>

        {/* ブックマーク一覧 */}
        {isLoading ? (
          <p className="text-sm text-muted text-center py-10">読み込み中...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted text-center py-10">ブックマークがありません。</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {filtered.map((bm) => (
              <li key={bm.id} className="py-5">
                <Link href={`/bookmarks/${bm.id}`} className="group block">
                  {showStatusBadge ? (
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-base font-bold text-foreground group-hover:text-accent transition-colors">
                        {bm.url}
                      </p>
                      {/* 公開ステータスバッジ */}
                      {STATUS_LABEL[bm.publishStatus] && (
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_LABEL[bm.publishStatus].className}`}>
                          {STATUS_LABEL[bm.publishStatus].label}
                        </span>
                      )}
                      {/* お気に入りアイコン */}
                      {bm.isFavorite && (
                        <span className="text-sm" title="お気に入り">⭐</span>
                      )}
                    </div>
                  ) : (
                    <p className="text-base font-bold text-foreground group-hover:text-accent transition-colors">
                      {bm.url}
                    </p>
                  )}
                  {bm.comment && (
                    <p className="mt-1 text-sm text-foreground line-clamp-2">
                      {bm.comment.replace(/<[^>]*>/g, '')}
                    </p>
                  )}
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {bm.postCategories.map(({ category }) => (
                      <span key={category.id} className="text-xs text-muted">
                        {category.name}
                      </span>
                    ))}
                    {bm.postTags.map(({ tag }) => (
                      <span
                        key={tag.id}
                        className={`text-xs ${
                          selectedTags.includes(tag.id)
                            ? 'text-accent font-medium'
                            : 'text-muted'
                        }`}
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

      </main>

      {/* カテゴリー管理ダイアログ */}
      <CategoryManagerDialog
        isOpen={isCategoryDialogOpen}
        onClose={() => setIsCategoryDialogOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={(id) => {
          setSelectedCategory(id)
          setIsCategoryDialogOpen(false)
        }}
        fallbackCategories={allCategories}
      />

      {/* タグ管理ダイアログ */}
      <TagManagerDialog
        isOpen={isTagDialogOpen}
        onClose={() => setIsTagDialogOpen(false)}
        selectedTags={selectedTags}
        onSelectTags={setSelectedTags}
        fallbackTags={allTags}
      />
    </div>
  )
}
