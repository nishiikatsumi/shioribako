'use client'

import { useState } from 'react'
import Image from 'next/image'
import TiptapEditor from '@/app/_components/TiptapEditor'

export type SupabaseUser = {
  id: string
  email?: string
}

export type FormValues = {
  url: string
  comment: string
  isFavorite: boolean
  isPublic: boolean
}

type Props = {
  mode: 'new' | 'edit'
  supabaseUser: SupabaseUser | null
  initialUrl?: string
  initialComment?: string
  initialIsFavorite?: boolean
  initialIsPublic?: boolean
  createdAt?: string
  onSubmit: (values: FormValues) => Promise<void>
  onDelete?: () => Promise<void>
  isSubmitting: boolean
  isDeleting?: boolean
  error: string | null
  onCancel: () => void
}

const MODE_CONFIG = {
  new: {
    badges: ['ブックマーク', 'ウェブ', '保存'],
    title: '新しいブックマークを追加',
    description: 'お気に入りのウェブページを簡単に保存しましょう。',
    submitLabel: '保存する',
    submittingLabel: '保存中...',
  },
  edit: {
    badges: ['ブックマーク', '編集'],
    title: 'ブックマークを編集',
    description: 'ブックマークの情報を更新または削除できます。',
    submitLabel: '更新する',
    submittingLabel: '更新中...',
  },
}

export default function BookmarkForm({
  mode,
  supabaseUser,
  initialUrl = '',
  initialComment = '',
  initialIsFavorite = false,
  initialIsPublic = false,
  createdAt,
  onSubmit,
  onDelete,
  isSubmitting,
  isDeleting = false,
  error,
  onCancel,
}: Props) {
  const config = MODE_CONFIG[mode]

  // フォーム内部状態
  const [url, setUrl] = useState(initialUrl)
  const [comment, setComment] = useState(initialComment)
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isPublic, setIsPublic] = useState(initialIsPublic)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSubmit = () => {
    onSubmit({ url, comment, isFavorite, isPublic })
  }

  const handleDeleteConfirm = async () => {
    await onDelete?.()
    setShowDeleteConfirm(false)
  }

  const date = createdAt?.slice(0, 10) ?? new Date().toISOString().slice(0, 10)

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-3xl px-6 py-12">

        {/* ヘッダーエリア */}
        <div className="mb-10 border-b border-border pb-8">
          <div className="flex items-center gap-2 mb-3">
            {config.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent"
              >
                {badge}
              </span>
            ))}
          </div>
          <h1 className="text-4xl font-extrabold text-foreground mb-3 tracking-tight">{config.title}</h1>
          <p className="text-muted mb-6">{config.description}</p>

          {/* 著者（Supabaseユーザー情報） */}
          <div className="flex items-center gap-3">
            <Image
              src="https://picsum.photos/seed/user/40/40"
              alt="ユーザー"
              width={40}
              height={40}
              className="rounded-full ring-2 ring-accent/30"
            />
            <div>
              <p className="text-sm font-semibold text-foreground leading-tight">
                {supabaseUser ? supabaseUser.email : 'ログインしていません'}
              </p>
              <p className="text-xs text-muted leading-tight">
                しおり箱のユーザー &middot; {date}
              </p>
            </div>
          </div>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* フォーム本体 */}
        <div className="flex flex-col gap-6">

          {/* URL入力 */}
          <div className="rounded-2xl bg-white border border-border p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🔗</span>
              <h2 className="text-lg font-bold text-foreground">URL入力</h2>
            </div>
            <p className="text-xs text-muted mb-4">ここに保存したいウェブページのURLを入力してください。</p>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-xl border border-border bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20"
            />
          </div>

          {/* カテゴリー選択 */}
          <div className="rounded-2xl bg-white border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">📁</span>
                  <h2 className="text-lg font-bold text-foreground">カテゴリー選択</h2>
                </div>
                <p className="text-xs text-muted">ブックマークを分類するカテゴリーを選択してください。</p>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-xl border border-accent px-4 py-2 text-sm font-semibold text-accent hover:bg-accent hover:text-white transition-all"
              >
                カテゴリー編集
              </button>
            </div>
          </div>

          {/* タグ指定 */}
          <div className="rounded-2xl bg-white border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🏷️</span>
                  <h2 className="text-lg font-bold text-foreground">タグ指定</h2>
                </div>
                <p className="text-xs text-muted">関連するタグを指定して、ブックマークを整理しましょう。</p>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-xl border border-accent px-4 py-2 text-sm font-semibold text-accent hover:bg-accent hover:text-white transition-all"
              >
                タグ編集
              </button>
            </div>
          </div>

          {/* お気に入り・公開 トグル */}
          <div className="rounded-2xl bg-white border border-border p-6 shadow-sm flex flex-col gap-5">

            {/* お気に入り */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">⭐</span>
                <div>
                  <p className="text-sm font-bold text-foreground">お気に入り指定</p>
                  <p className="text-xs text-muted">このブックマークをお気に入りに追加します</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFavorite(!isFavorite)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isFavorite ? 'bg-accent' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    isFavorite ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="border-t border-border" />

            {/* 公開指定 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌐</span>
                <div>
                  <p className="text-sm font-bold text-foreground">公開指定</p>
                  <p className="text-xs text-muted">このブックマークを公開します</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isPublic ? 'bg-accent' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    isPublic ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

          </div>

          {/* ブログ投稿欄 */}
          <div className="rounded-2xl bg-white border border-border shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-6 pt-6 mb-4">
              <span className="text-lg">✍️</span>
              <h2 className="text-lg font-bold text-foreground">ブログ投稿欄</h2>
            </div>
            <div className="px-6 pb-6">
              <TiptapEditor
                initialContent={initialComment}
                onChange={(html) => setComment(html)}
              />
            </div>
          </div>

          {/* ボタンエリア */}
          <div className="flex justify-between gap-3 pt-2 pb-8">
            {/* 削除ボタン（editモードのみ） */}
            <div>
              {mode === 'edit' && onDelete && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting}
                  className="rounded-xl border border-red-300 px-6 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  削除する
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-xl border border-border px-6 py-2.5 text-sm font-semibold text-muted hover:bg-gray-100 transition-colors"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? config.submittingLabel : config.submitLabel}
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* 削除確認モーダル（editモードのみ） */}
      {mode === 'edit' && showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-foreground mb-2">ブックマークを削除しますか？</h3>
            <p className="text-sm text-muted mb-6">この操作は元に戻せません。</p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-xl border border-border px-5 py-2 text-sm font-semibold text-muted hover:bg-gray-100 transition-colors"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? '削除中...' : '削除する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
