export default function PasswordNewPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <span className="text-lg font-bold text-accent">※ しおり箱</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-lg">
          <h1 className="text-center text-2xl font-bold">パスワード再設定</h1>

          <form className="mt-10 flex flex-col gap-6">
            <div>
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                新しいパスワード
              </label>
              <input
                type="password"
                id="password"
                placeholder="新しいパスワードを入力"
                className="mt-2 w-full rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label htmlFor="password-confirm" className="text-sm font-medium text-foreground">
                新しいパスワードを再入力
              </label>
              <input
                type="password"
                id="password-confirm"
                placeholder="新しいパスワードを再入力"
                className="mt-2 w-full rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none focus:border-accent"
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="rounded-lg bg-red-800 px-6 py-2.5 text-sm font-medium text-white hover:bg-red-900 transition-colors"
              >
                パスワードをリセット
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
