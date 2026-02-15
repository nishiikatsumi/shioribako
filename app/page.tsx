import Image from "next/image";
import Link from "next/link";

const sidebarPosts = [
  {
    tag: "タグ",
    title: "投稿タイトル。新しいアイデアやインスピレーションを見つけるために、...",
    views: "34,800回の閲覧",
  },
  { tag: "記事", title: "ミニマリズムの芸術", views: "900" },
  { tag: "記事", title: "旅行の裏技", views: "750" },
  { tag: "記事", title: "健康的な生活のヒント", views: "1,500" },
  { tag: "記事", title: "ファッションの最前線", views: "600" },
];

const featuredArticles = [
  {
    title: "これは記事です：タイトルのロレム・イプサム・ドル・...",
    tags: ["トピック1", "トピック2"],
    date: "2024年3月24日",
    image: "https://picsum.photos/seed/article1/400/300",
  },
  {
    title: "ミニマリストライフ",
    tags: ["ライフスタイル"],
    date: "2026年1月24日",
    image: "https://picsum.photos/seed/article2/400/300",
  },
  {
    title: "ウェルネストレンド",
    tags: ["健康"],
    date: "2026年1月25日",
    image: "https://picsum.photos/seed/article3/400/300",
  },
  {
    title: "人気の旅行先",
    tags: ["旅行"],
    date: "2026年1月22日",
    image: "https://picsum.photos/seed/article4/400/300",
  },
  {
    title: "ブロックチェーンの解説",
    tags: ["テクノロジー"],
    date: "2026年1月21日",
    image: "https://picsum.photos/seed/article5/400/300",
  },
  {
    title: "サステナブルファッション",
    tags: ["ライフスタイル"],
    date: "2026年1月20日",
    image: "https://picsum.photos/seed/article6/400/300",
  },
  {
    title: "栄養の神話",
    tags: ["健康"],
    date: "2026年1月19日",
    image: "https://picsum.photos/seed/article7/400/300",
  },
  {
    title: "冒険スポーツ",
    tags: ["旅行"],
    date: "2026年1月18日",
    image: "https://picsum.photos/seed/article8/400/300",
  },
];

const navItems = [
  { label: "ホーム", href: "/" },
  { label: "探す", href: "/search" },
  { label: "公開", href: "/public" },
  { label: "プライベート", href: "/private" },
  { label: "アカウント", href: "/account" },
  { label: "サインイン", href: "/signin" },
];

const footerExploreLinks = [
  { label: "テクノロジー", href: "#" },
  { label: "ライフスタイル", href: "#" },
  { label: "健康", href: "#" },
  { label: "旅行", href: "#" },
];

const footerCompanyLinks = [
  { label: "私たちについて", href: "#" },
  { label: "キャリア", href: "#" },
  { label: "お問い合わせ", href: "#" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-accent">
            <span className="text-xl">☺</span>
            <span>しおり箱</span>
          </Link>
          <nav className="flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-foreground hover:text-accent transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-12 gap-8">
            {/* Sidebar - おすすめの投稿 */}
            <div className="col-span-3">
              <h2 className="mb-6 text-sm font-bold">おすすめの投稿</h2>
              <div className="flex flex-col gap-4">
                {sidebarPosts.map((post, i) => (
                  <Link
                    key={i}
                    href="#"
                    className="group flex items-center justify-between border-b border-border pb-4 last:border-0"
                  >
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-accent">
                        {post.tag}
                      </span>
                      <p className="mt-1 text-sm font-bold leading-snug group-hover:text-accent transition-colors">
                        {post.title}
                      </p>
                      <span className="mt-1 text-xs text-muted">
                        {post.views}
                      </span>
                    </div>
                    <span className="ml-2 text-muted">›</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Main Featured Article */}
            <div className="col-span-9">
              <div className="grid grid-cols-2 gap-8">
                {/* Text Content */}
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-sm text-accent">
                    <span>テクノロジー、</span>
                    <span>ライフスタイル</span>
                  </div>
                  <h1 className="mt-4 text-5xl font-bold leading-tight">
                    発見する
                  </h1>
                  <p className="mt-4 text-base text-muted leading-relaxed">
                    最新のテクノロジーとライフスタイルのトレンドを探求しましょう。
                  </p>
                  <p className="mt-6 text-sm text-muted">2026年1月25日</p>
                </div>
                {/* Hero Image */}
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src="https://picsum.photos/seed/hero/800/600"
                    alt="発見する"
                    width={800}
                    height={600}
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trend Section */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-2 gap-12 items-center">
            {/* Trend Image */}
            <div className="overflow-hidden rounded-2xl">
              <Image
                src="https://picsum.photos/seed/trend/800/900"
                alt="トレンド"
                width={800}
                height={900}
                className="h-full w-full object-cover"
              />
            </div>
            {/* Trend Text */}
            <div>
              <div className="flex items-center gap-2 text-sm text-accent">
                <span>健康、</span>
                <span>旅行</span>
              </div>
              <h2 className="mt-4 text-5xl font-bold">トレンド</h2>
              <p className="mt-4 text-base text-muted leading-relaxed">
                健康と旅行のトレンドトピックをチェックしましょう。
              </p>
              <p className="mt-6 text-sm text-muted">2026年1月24日</p>
            </div>
          </div>
        </section>

        {/* Featured Articles Section */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">特集記事</h2>
            <Link
              href="#"
              className="flex items-center gap-1 text-sm text-accent hover:underline"
            >
              すべてを見る
              <span>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {featuredArticles.map((article, i) => (
              <Link key={i} href="#" className="group">
                <div className="overflow-hidden rounded-xl">
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={400}
                    height={300}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-3 text-sm font-bold leading-snug group-hover:text-accent transition-colors">
                  {article.title}
                </h3>
                <div className="mt-1 flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span key={tag} className="text-xs text-accent">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-1 text-xs text-muted">{article.date}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-4 gap-8">
            {/* Logo & Social */}
            <div>
              <Link href="/" className="flex items-center gap-2 text-lg font-bold text-accent">
                <span className="text-xl">☺</span>
                <span>しおり箱</span>
              </Link>
              <div className="mt-4 flex items-center gap-4">
                <Link href="#" className="text-muted hover:text-foreground transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </Link>
                <Link href="#" className="text-muted hover:text-foreground transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </Link>
                <Link href="#" className="text-muted hover:text-foreground transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* 探す */}
            <div>
              <h3 className="mb-4 text-sm font-bold">探す</h3>
              <ul className="flex flex-col gap-2">
                {footerExploreLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 会社 */}
            <div>
              <h3 className="mb-4 text-sm font-bold">会社</h3>
              <ul className="flex flex-col gap-2">
                {footerCompanyLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* サブスクライブ */}
            <div>
              <h3 className="mb-4 text-sm font-bold">サブスクライブ</h3>
              <p className="mb-4 text-sm text-muted">最新ニュースを受け取る</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="メールアドレス"
                  className="flex-1 rounded-lg border border-border bg-gray-50 px-4 py-2 text-sm outline-none focus:border-accent"
                />
                <button className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
                  サブスクライブ
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
