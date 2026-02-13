import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <span className="text-lg font-bold text-accent">※ しおり箱</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold">お問い合わせ</h1>
          <p className="mt-3 text-base text-muted">
            管理者へのお問い合わせはこちらからどうぞ。
          </p>
        </div>

        {/* Form */}
        <form className="mt-10 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First name"
              className="rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none focus:border-accent"
            />
            <input
              type="text"
              placeholder="Last name"
              className="rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            className="rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none focus:border-accent"
          />
          <textarea
            placeholder="Placeholder"
            rows={4}
            className="rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none focus:border-accent resize-none"
          />
          <div>
            <button
              type="submit"
              className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              Submit
            </button>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-6">
          <Link href="/help" className="text-sm text-foreground hover:text-accent transition-colors">
            FAQのリンク
          </Link>
        </div>
      </footer>
    </div>
  );
}
