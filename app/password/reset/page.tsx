export default function PasswordResetPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header>
        <div className="mx-auto max-w-7xl px-6 py-4">
          <span className="text-lg font-bold">※ しおり箱</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-2xl font-bold">パスワードリセット</h1>

        <form className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="text-sm text-foreground">
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              placeholder="メールアドレスを入力してください"
              className="mt-1 w-full rounded-lg border border-border bg-gray-50 px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <button
              type="submit"
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              送信
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
