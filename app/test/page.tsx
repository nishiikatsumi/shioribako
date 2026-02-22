import Image from "next/image";

export default function TestPage() {
  const bookmark = {
    title:
      "また病院がVPN経由でやられたわけだがVPNは悪だね｜ロードバランスすだちくん（仮）",
    description:
      "シンジです。2026年2月9日の午前1時50分、日本医科大学武蔵小杉病院のナースコールシステムがランサムウェア攻撃を受けました。侵入経路は医療機器保守用VPN装置です。またVPNです。またです。人類は過去の経験から学ばない生き物でしたね。 約1万人分の患者の個人情報（氏名、性別、住所、電話番号、生年...",
    category: "テクノロジー",
    date: "2026/02/15 14:19",
    source: {
      name: "note.cloudnative.co.jp",
      favicon: "https://note.cloudnative.co.jp/favicon.ico",
    },
    tags: [
      "セキュリティ",
      "あとで読む",
      "VPN",
      "ネットワーク",
      "security",
      "network",
      "ZTNA",
      "医療",
      "企業",
      "設計",
    ],
    thumbnail: "https://picsum.photos/seed/vpn/300/200",
  };

  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-3xl">
        {/* ブックマークカード */}
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <div className="flex">
            {/* 左側：コンテンツ */}
            <div className="flex flex-1 flex-col justify-between p-6">
              {/* タイトル */}
              <h2 className="text-lg font-bold leading-relaxed text-foreground">
                {bookmark.title}
              </h2>

              {/* 説明文 */}
              <p className="mt-3 text-sm leading-relaxed text-muted line-clamp-3">
                {bookmark.description}
              </p>

              {/* カテゴリと日付 */}
              <div className="mt-4 flex items-center gap-4">
                <span className="rounded-md bg-blue-500 px-3 py-1 text-xs font-medium text-white">
                  {bookmark.category}
                </span>
                <span className="text-sm text-muted">{bookmark.date}</span>
              </div>
            </div>

            {/* 右側：サムネイル */}
            <div className="relative hidden w-48 shrink-0 sm:block">
              <Image
                src={bookmark.thumbnail}
                alt={bookmark.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* ソース情報 */}
        <div className="mt-4 flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-gray-800 text-xs font-bold text-white">
            n
          </div>
          <span className="text-sm text-muted">{bookmark.source.name}</span>
        </div>

        {/* タグ一覧 */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {bookmark.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-white px-4 py-1.5 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
