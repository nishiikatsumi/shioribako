'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/app/_libs/supabase'
import { Tag } from './BookmarkShowForm'

// ─── Props ──────────────────────────────────────────────────────────────────
interface TagManagerDialogProps {
  isOpen: boolean
  onClose: () => void
  /** 現在選択中のタグID一覧（ブックマーク絞り込み用・複数選択可） */
  selectedTags: string[]
  /** タグ選択変更時のコールバック */
  onSelectTags: (tagIds: string[]) => void
  /** 非ログイン時に使うフォールバックタグ（ブックマークから抽出済み） */
  fallbackTags: Tag[]
}

// ─── チェックボックスUI ──────────────────────────────────────────────────────
function CheckBox({ checked }: { checked: boolean }) {
  return (
    <span
      className={`shrink-0 size-4 rounded border-2 flex items-center justify-center transition-colors ${
        checked ? 'border-accent bg-accent' : 'border-border bg-white'
      }`}
    >
      {checked && (
        <svg
          className="size-2.5 text-white"
          fill="none"
          viewBox="0 0 10 10"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path d="M1.5 5l2.5 2.5 4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  )
}

// ─── メインコンポーネント ────────────────────────────────────────────────────
export default function TagManagerDialog({
  isOpen,
  onClose,
  selectedTags,
  onSelectTags,
  fallbackTags,
}: TagManagerDialogProps) {
  const [supabaseId, setSupabaseId] = useState<string | null>(null)
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // 新規追加
  const [newName, setNewName] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  // 編集中
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  // 削除確認
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // メッセージ
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // ダイアログが開いたときに初期化
  useEffect(() => {
    if (!isOpen) return

    setError(null)
    setSuccessMsg(null)
    setNewName('')
    setEditingId(null)
    setEditingName('')
    setDeleteConfirmId(null)

    const init = async () => {
      setIsLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          // 非ログイン時はフォールバックタグを表示
          setTags(fallbackTags)
          setSupabaseId(null)
          return
        }
        setSupabaseId(user.id)
        const res = await fetch(`/api/tags?supabaseId=${user.id}`)
        if (!res.ok) return
        const data = await res.json()
        setTags(data.tags)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // 成功メッセージを一定時間後に消す
  const showSuccess = (msg: string) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 2500)
  }

  // タグの選択/解除をトグル
  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onSelectTags(selectedTags.filter(id => id !== tagId))
    } else {
      onSelectTags([...selectedTags, tagId])
    }
  }

  // ─── CRUD ───────────────────────────────────────────────────────────────

  /** 新規タグを追加 */
  const handleAdd = async () => {
    if (!newName.trim()) return
    if (!supabaseId) { setError('ログインが必要です'); return }
    setError(null)
    setIsAdding(true)
    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supabaseId, name: newName.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setTags(prev => [...prev, data.tag])
      setNewName('')
      showSuccess(`「${data.tag.name}」を追加しました`)
    } catch (e) {
      console.error(e)
      setError('追加に失敗しました')
    } finally {
      setIsAdding(false)
    }
  }

  /** タグ名を更新 */
  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return
    if (!supabaseId) { setError('ログインが必要です'); return }
    setError(null)
    setIsUpdating(true)
    try {
      const res = await fetch(`/api/tags/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supabaseId, name: editingName.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setTags(prev =>
        prev.map(t => t.id === id ? { ...t, name: data.tag.name } : t)
      )
      setEditingId(null)
      setEditingName('')
      showSuccess('タグ名を更新しました')
    } catch (e) {
      console.error(e)
      setError('更新に失敗しました')
    } finally {
      setIsUpdating(false)
    }
  }

  /** タグを削除 */
  const handleDelete = async (id: string) => {
    if (!supabaseId) { setError('ログインが必要です'); return }
    setError(null)
    setIsDeleting(true)
    try {
      const deletedName = tags.find(t => t.id === id)?.name ?? ''
      const res = await fetch(`/api/tags/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supabaseId }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error)
        return
      }
      setTags(prev => prev.filter(t => t.id !== id))
      // 削除したタグが選択中なら選択から除外
      if (selectedTags.includes(id)) {
        onSelectTags(selectedTags.filter(tid => tid !== id))
      }
      setDeleteConfirmId(null)
      showSuccess(`「${deletedName}」を削除しました`)
    } catch (e) {
      console.error(e)
      setError('削除に失敗しました')
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* バックドロップ */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ダイアログ本体 */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl flex flex-col max-h-[80vh]">

        {/* ─── ヘッダー ─────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-foreground">タグ管理</h2>
            {selectedTags.length > 0 && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-white">
                {selectedTags.length}件選択中
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-foreground transition-colors text-lg leading-none"
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>

        {/* ─── ボディ（スクロール可能） ─────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">

          {/* エラー表示 */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2">
              <span className="text-red-500 text-sm">⚠</span>
              <p className="text-xs text-red-600">{error}</p>
              <button
                type="button"
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600 text-xs"
              >
                ✕
              </button>
            </div>
          )}

          {/* 成功メッセージ */}
          {successMsg && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2">
              <span className="text-green-500 text-sm">✓</span>
              <p className="text-xs text-green-700">{successMsg}</p>
            </div>
          )}

          {/* ── 新規追加フォーム ── */}
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
              新規追加
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newName}
                onChange={e => { setNewName(e.target.value); setError(null) }}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="タグ名を入力"
                disabled={isAdding}
                className="flex-1 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none disabled:opacity-50"
              />
              <button
                type="button"
                onClick={handleAdd}
                disabled={!newName.trim() || isAdding}
                className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40 transition-opacity whitespace-nowrap"
              >
                {isAdding ? '追加中...' : '追加'}
              </button>
            </div>
          </div>

          {/* ── タグ一覧 ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">
                タグ一覧
                <span className="ml-1 normal-case font-normal text-muted">（複数選択可）</span>
              </p>
              {selectedTags.length > 0 && (
                <button
                  type="button"
                  onClick={() => onSelectTags([])}
                  className="text-xs text-accent hover:opacity-70 transition-opacity"
                >
                  すべて解除
                </button>
              )}
            </div>

            {isLoading ? (
              <p className="text-sm text-muted text-center py-6">読み込み中...</p>
            ) : (
              <ul className="space-y-1">

                {/* 各タグ */}
                {tags.map(tag => (
                  <li key={tag.id} className="rounded-lg border border-border overflow-hidden">

                    {editingId === tag.id ? (
                      /* ── 編集モード ── */
                      <div className="flex items-center gap-2 px-3 py-2 bg-blue-50/50">
                        <input
                          type="text"
                          value={editingName}
                          onChange={e => { setEditingName(e.target.value); setError(null) }}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleUpdate(tag.id)
                            if (e.key === 'Escape') { setEditingId(null); setEditingName('') }
                          }}
                          autoFocus
                          disabled={isUpdating}
                          className="flex-1 rounded border border-border px-2 py-1 text-sm text-foreground focus:border-accent focus:outline-none min-w-0 disabled:opacity-50"
                        />
                        <button
                          type="button"
                          onClick={() => handleUpdate(tag.id)}
                          disabled={!editingName.trim() || isUpdating}
                          className="shrink-0 text-xs font-medium text-accent hover:opacity-70 transition-opacity disabled:opacity-40"
                        >
                          {isUpdating ? '保存中...' : '保存'}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setEditingId(null); setEditingName('') }}
                          disabled={isUpdating}
                          className="shrink-0 text-xs text-muted hover:text-foreground transition-colors"
                        >
                          キャンセル
                        </button>
                      </div>

                    ) : deleteConfirmId === tag.id ? (
                      /* ── 削除確認モード ── */
                      <div className="flex items-center gap-2 px-3 py-2 bg-red-50">
                        <p className="flex-1 text-sm text-foreground min-w-0">
                          「<span className="font-medium">{tag.name}</span>」を削除しますか？
                        </p>
                        <button
                          type="button"
                          onClick={() => handleDelete(tag.id)}
                          disabled={isDeleting}
                          className="shrink-0 text-xs font-medium text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded transition-colors disabled:opacity-50"
                        >
                          {isDeleting ? '削除中...' : '削除'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          disabled={isDeleting}
                          className="shrink-0 text-xs text-muted hover:text-foreground transition-colors"
                        >
                          キャンセル
                        </button>
                      </div>

                    ) : (
                      /* ── 通常モード ── */
                      <div className="flex items-center gap-2 px-3 py-2">
                        {/* タグ選択（チェックボックス形式・複数選択） */}
                        <button
                          type="button"
                          onClick={() => toggleTag(tag.id)}
                          className="flex-1 flex items-center gap-2.5 text-sm text-left min-w-0"
                        >
                          <CheckBox checked={selectedTags.includes(tag.id)} />
                          <span className={`truncate ${selectedTags.includes(tag.id) ? 'font-semibold text-accent' : 'text-foreground'}`}>
                            {tag.name}
                          </span>
                        </button>

                        {/* 編集・削除ボタン（常に表示） */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(tag.id)
                              setEditingName(tag.name)
                              setDeleteConfirmId(null)
                              setError(null)
                            }}
                            className="text-xs text-muted hover:text-foreground px-1.5 py-0.5 rounded hover:bg-gray-100 transition-colors"
                          >
                            編集
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteConfirmId(tag.id)
                              setEditingId(null)
                            }}
                            className="text-xs text-red-400 hover:text-red-600 px-1.5 py-0.5 rounded hover:bg-red-50 transition-colors"
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}

                {/* 空状態 */}
                {tags.length === 0 && (
                  <li className="text-sm text-muted text-center py-4">
                    タグがありません
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* ─── フッター ─────────────────────────────────────── */}
        <div className="px-6 py-4 border-t border-border shrink-0 flex items-center justify-between">
          {/* 選択状況の概要 */}
          <p className="text-xs text-muted">
            {selectedTags.length > 0
              ? `${selectedTags.length}件のタグで絞り込み中`
              : 'タグをチェックして絞り込めます'}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-6 py-2 text-sm font-medium text-foreground hover:bg-gray-50 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}
