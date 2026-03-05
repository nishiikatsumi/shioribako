'use client'
import { supabase } from "@/app/_libs/supabase"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from "next/link";

export default function SigninPage() {
  const router = useRouter()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError('メールアドレスまたはパスワードが正しくありません');
      } else {
        router.push('/bookmarks');
      }
    } catch {
      setError('通信エラーが発生しました。再度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <main className="flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold">サインイン</h1>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              しおり箱にログインして、すべてのブックマークを管理しましょう。
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none focus:border-accent"
            />
            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-accent py-3 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>

          {/* Remember me */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <input type="checkbox" id="remember" className="h-4 w-4 rounded border-border" />
            <label htmlFor="remember" className="text-xs text-muted">
              ログイン状態を保持する
            </label>
          </div>

          {/* Links */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <Link href="/password/reset" className="text-sm text-foreground hover:text-accent transition-colors">
              パスワードをお忘れですか？
            </Link>
            <Link href="/signup" className="text-sm text-foreground hover:text-accent transition-colors">
              新規登録
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
