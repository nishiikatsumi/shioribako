'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/app/_libs/supabase'
import { Category } from './BookmarkShowForm'

// ─── Props ──────────────────────────────────────────────────────────────────
interface CategoryManagerDialogProps {
  isOpen: boolean
  onClose: () => void
  /** 現在選択中のカテゴリーID（ブックマーク絞り込み用） */
  selectedCategory: string
  /** カテゴリー選択時のコールバック */
  onSelectCategory: (categoryId: string) => void
  /** 非ログイン時に使うフォールバックカテゴリー（ブックマークから抽出済み） */
  fallbackCategories: Category[]
}

// ─── ラジオドット（再利用UI） ─────────────────────────────────────────────────
function RadioDot({ selected }: { selected: boolean }) {
  return (
    <span
      className={`shrink-0 size-4 rounded-full border-2 flex items-center justify-center transition-colors ${
        selected ? 'border-accent' : 'border-border'
      }`}
    >
      {selected && <span className="size-2 rounded-full bg-accent" />}
    </span>
  )
}

// ─── メインコンポーネント ────────────────────────────────────────────────────
export default function CategoryManagerDialog({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  fallbackCategories,
}: CategoryManagerDialogProps) {
  const [supabaseId, setSupabaseId] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
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

  // エラー・成功メッセージ
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
          // 非ログイン時はフォールバックカテゴリーを表示
          setCategories(fallbackCategories)
          setSupabaseId(null)
          return
        }
        setSupabaseId(user.id)
        const res = await fetch(`/api/categories?supabaseId=${user.id}`)
        if (!res.ok) return
        const data = await res.json()
        setCategories(data.categories)
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

  // ─── CRUD ───────────────────────────────────────────────────────────────

  /** 新規カテゴリーを追加 */
  const handleAdd = async () => {
    if (!newName.trim()) return
    if (!supabaseId) { setError('ログインが必要です'); return }
    setError(null)
    setIsAdding(true)
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supabaseId, name: newName.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setCategories(prev => [...prev, data.category])
      setNewName('')
      showSuccess(`「${data.category.name}」を追加しました`)
    } catch (e) {
      console.error(e)
      setError('追加に失敗しました')
    } finally {
      setIsAdding(false)
    }
  }

  /** カテゴリー名を更新 */
  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return
    if (!supabaseId) { setError('ログインが必要です'); return }
    setError(null)
    setIsUpdating(true)
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supabaseId, name: editingName.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setCategories(prev =>
        prev.map(c => c.id === id ? { ...c, name: data.category.name } : c)
      )
      setEditingId(null)
      setEditingName('')
      showSuccess('カテゴリー名を更新しました')
    } catch (e) {
      console.error(e)
      setError('更新に失敗しました')
    } finally {
      setIsUpdating(false)
    }
  }

  /** カテゴリーを削除 */
  const handleDelete = async (id: string) => {
    if (!supabaseId) { setError('ログインが必要です'); return }
    setError(null)
    setIsDeleting(true)
    try {
      const deletedName = categories.find(c => c.id === id)?.name ?? ''
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supabaseId }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error)
        return
      }
      setCategories(prev => prev.filter(c => c.id !== id))
      // 削除したカテゴリーが選択中なら選択解除
      if (selectedCategory === id) onSelectCategory('')
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
          <h2 className="text-base font-bold text-foreground">カテゴリー管理</h2>
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
                placeholder="カテゴリー名を入力"
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

          {/* ── カテゴリー一覧 ── */}
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
              カテゴリー一覧
            </p>

            {isLoading ? (
              <p className="text-sm text-muted text-center py-6">読み込み中...</p>
            ) : (
              <ul className="space-y-1">

                {/* 「すべて」選択肢 */}
                <li>
                  <button
                    type="button"
                    onClick={() => onSelectCategory('')}
                    className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors"
                  >
                    <RadioDot selected={selectedCategory === ''} />
                    <span className={selectedCategory === '' ? 'font-semibold text-accent' : 'text-foreground'}>
                      すべて
                    </span>
                  </button>
                </li>

                {/* 各カテゴリー */}
                {categories.map(cat => (
                  <li key={cat.id} className="rounded-lg border border-border overflow-hidden">

                    {editingId === cat.id ? (
                      /* ── 編集モード ── */
                      <div className="flex items-center gap-2 px-3 py-2 bg-blue-50/50">
                        <input
                          type="text"
                          value={editingName}
                          onChange={e => { setEditingName(e.target.value); setError(null) }}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleUpdate(cat.id)
                            if (e.key === 'Escape') { setEditingId(null); setEditingName('') }
                          }}
                          autoFocus
                          disabled={isUpdating}
                          className="flex-1 rounded border border-border px-2 py-1 text-sm text-foreground focus:border-accent focus:outline-none min-w-0 disabled:opacity-50"
                        />
                        <button
                          type="button"
                          onClick={() => handleUpdate(cat.id)}
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

                    ) : deleteConfirmId === cat.id ? (
                      /* ── 削除確認モード ── */
                      <div className="flex items-center gap-2 px-3 py-2 bg-red-50">
                        <p className="flex-1 text-sm text-foreground min-w-0">
                          「<span className="font-medium">{cat.name}</span>」を削除しますか？
                        </p>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat.id)}
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
                        {/* カテゴリー選択（ブックマーク絞り込み用） */}
                        <button
                          type="button"
                          onClick={() => onSelectCategory(cat.id)}
                          className="flex-1 flex items-center gap-2.5 text-sm text-left min-w-0"
                        >
                          <RadioDot selected={selectedCategory === cat.id} />
                          <span className={`truncate ${selectedCategory === cat.id ? 'font-semibold text-accent' : 'text-foreground'}`}>
                            {cat.name}
                          </span>
                        </button>

                        {/* 編集・削除ボタン（常に表示） */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(cat.id)
                              setEditingName(cat.name)
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
                              setDeleteConfirmId(cat.id)
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
                {categories.length === 0 && (
                  <li className="text-sm text-muted text-center py-4">
                    カテゴリーがありません
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* ─── フッター ─────────────────────────────────────── */}
        <div className="px-6 py-4 border-t border-border shrink-0 flex justify-end">
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
