export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <span className="text-lg font-bold text-accent">※ しおり箱</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold">FAQ</h1>

          <p className="mt-24 text-base text-muted">記載内容は後日確定</p>
        </div>
      </main>
    </div>
  );
}
