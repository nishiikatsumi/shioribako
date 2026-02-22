'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

type ToggleRowProps = {
  label: string
  description: string
  checked: boolean
  onChange: (val: boolean) => void
  highlighted?: boolean
}

function ToggleRow({ label, description, checked, onChange, highlighted = false }: ToggleRowProps) {
  return (
    <div className={`flex items-center justify-between py-4 ${highlighted ? 'border-l-4 border-blue-500 pl-3' : ''}`}>
      <div>
        <p className="text-sm font-bold text-foreground">{label}</p>
        <p className="text-xs text-muted mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-13 shrink-0 items-center rounded-full transition-colors focus:outline-none ${
          checked ? 'bg-accent' : 'bg-gray-300'
        }`}
        style={{ width: '52px' }}
      >
        <span
          className={`inline-block h-6 w-6 rounded-full shadow-md transition-transform ${
            checked ? 'translate-x-6 bg-gray-900' : 'translate-x-1 bg-gray-900'
          }`}
        />
      </button>
    </div>
  )
}

export default function AccountPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const passwordMismatch = passwordConfirm !== '' && password !== passwordConfirm
  const passwordMatch = passwordConfirm !== '' && password === passwordConfirm
  const [avatarSrc, setAvatarSrc] = useState('https://picsum.photos/seed/avatar/80/80')

  const [isPublicProfile, setIsPublicProfile] = useState(true)
  const [isEmailNotification, setIsEmailNotification] = useState(false)
  const [isTwoFactor, setIsTwoFactor] = useState(true)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarSrc(URL.createObjectURL(file))
    }
  }

  const handleUpdate = () => {
    if (passwordMismatch) return
    // TODO: 更新処理
  }

  const handleWithdraw = () => {
    // TODO: 退会処理
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-2xl px-6 py-10">

        {/* タイトル */}
        <h1 className="text-2xl font-bold text-foreground mb-8">ユーザーアカウント設定</h1>

        {/* アバター + ユーザー名 */}
        <div className="flex items-start gap-6 mb-6">
          {/* アバター */}
          <div className="relative shrink-0">
            <Image
              src={avatarSrc}
              alt="アバター"
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white shadow hover:opacity-90 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* ユーザー名入力 */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-foreground mb-1">ユーザー名</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="新しいユーザー名を入力"
              className="w-full rounded-lg border-0 bg-gray-100 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
        </div>

        <hr className="border-border mb-6" />

        {/* プライバシー設定 */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-foreground mb-2">プライバシー設定</h2>
          <div className="divide-y divide-border">
            <ToggleRow
              label="公開プロフィール"
              description="他のユーザーにプロフィールを表示する"
              checked={isPublicProfile}
              onChange={setIsPublicProfile}
            />
            <ToggleRow
              label="メール通知"
              description="新しいメッセージの通知を受け取る"
              checked={isEmailNotification}
              onChange={setIsEmailNotification}
            />
            <ToggleRow
              label="二段階認証"
              description="アカウントのセキュリティを強化する"
              checked={isTwoFactor}
              onChange={setIsTwoFactor}
              highlighted
            />
          </div>
        </section>

        <hr className="border-border mb-6" />

        {/* アカウント情報 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4">アカウント情報</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full rounded-lg border-0 bg-gray-100 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">パスワード</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="新しいパスワードを入力"
                className="w-full rounded-lg border-0 bg-gray-100 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">パスワード（確認）</label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="パスワードを再入力"
                className={`w-full rounded-lg border-0 px-4 py-2.5 text-sm outline-none focus:ring-2 transition-colors ${
                  passwordMismatch
                    ? 'bg-red-50 focus:ring-red-300'
                    : passwordMatch
                    ? 'bg-green-50 focus:ring-green-300'
                    : 'bg-gray-100 focus:ring-accent/30'
                }`}
              />
              {passwordMismatch && (
                <p className="mt-1.5 text-xs text-red-500">パスワードが一致しません。</p>
              )}
              {passwordMatch && (
                <p className="mt-1.5 text-xs text-green-600">パスワードが一致しています。</p>
              )}
            </div>
          </div>
        </section>

        <hr className="border-border mb-6" />

        {/* ボタン */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleUpdate}
            className="rounded-lg border border-border px-5 py-2 text-sm font-medium text-foreground hover:bg-gray-50 transition-colors"
          >
            更新
          </button>
          <button
            type="button"
            onClick={handleWithdraw}
            className="rounded-lg border border-border px-5 py-2 text-sm font-medium text-foreground hover:bg-gray-50 transition-colors"
          >
            退会
          </button>
        </div>

      </main>
    </div>
  )
}
