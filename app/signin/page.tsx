import Link from "next/link";

export default function SigninPage() {
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

          {/* Form */}
          <form className="mt-8 flex flex-col gap-4">
            <input
              type="email"
              placeholder="メールアドレス"
              className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none focus:border-accent"
            />
            <input
              type="password"
              placeholder="パスワード"
              className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-accent py-3 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              ログイン
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted">or continue with</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Google Button */}
          <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-white px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>

          {/* Remember me */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <input type="checkbox" id="remember" className="h-4 w-4 rounded border-border" />
            <label htmlFor="remember" className="text-xs text-muted">
              ログイン状態を保持する
            </label>
          </div>

          {/* Links */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <Link href="#" className="text-sm text-foreground hover:text-accent transition-colors">
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
