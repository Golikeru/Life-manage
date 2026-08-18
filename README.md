# Life Manager

大学生活・就職活動・資格勉強・アルバイト・運動・自己成長など、複数の目標を同時に管理するための個人向けToDo・習慣管理アプリです。単なるToDoリストではなく「毎日の行動を可視化し、継続的な成長を支援する」ことをコンセプトに設計しています。

---

## 1. できあがったもの

- Next.js（App Router）+ React + TypeScript + Tailwind CSS + shadcn/ui風のUIコンポーネント一式
- Supabase（PostgreSQL / Auth / Row Level Security）を使った本格的なバックエンド
- スマートフォン最優先のレスポンシブUI（下部タブナビゲーション、Apple風の落ち着いたデザイン）
- 認証・ToDo管理・カテゴリ管理・習慣管理・カレンダー・ダッシュボード（分析グラフ）・設定画面

コードはこのプロジェクト一式として `life-manager/` フォルダにまとめてあります。

## 2. 重要: このセッションでできなかったこと（環境上の制約）

このセッションが動いているクラウド環境は、セキュリティ上の理由で `npm`（パッケージレジストリ）や `pypi` などへの外部アクセスがブロックされていました。そのため、

- `npm install` によるパッケージのダウンロード
- `npm run build` / `npm run dev` による実際の起動確認
- Supabaseプロジェクトの作成（Supabase側のアカウント操作が必要なため、代理実行不可）
- Vercelへのデプロイ（同上）

は、この場では実行できませんでした。

**私が代わりに行ったこと:**
- 全てのソースコード・SQL・設定ファイルを、実績のある構成（Next.js 15 / React 19 / Supabase SSR公式パターン）に沿って手作業で作成
- import文の解決・エクスポート名の整合性・JSX構文のバランス・Tailwindクラスの妥当性などを、静的なスクリプトとコードレビューで確認
- 見つかった不整合（Tailwindの無効なクラス、`useSearchParams`のSuspense境界不足など）はその場で修正済み

ただし `tsc` や Next.js のビルドを直接実行したわけではないため、**あなたのPCで `npm install` → `npm run dev` を実行した際に、万が一小さなエラーが出た場合は、エラーメッセージをそのまま貼り付けて教えてください。私がすぐに修正します。**

---

## 3. セットアップ手順（あなたが行う操作）

### 手順A: Supabaseプロジェクトを作成する

1. https://supabase.com にアクセスし、GitHubアカウントなどでサインアップ/ログイン
2. 「New Project」から新しいプロジェクトを作成（プロジェクト名は任意、リージョンは `Northeast Asia (Tokyo)` がおすすめ、DBパスワードは控えておく）
3. プロジェクトが作成できたら、左メニューの **SQL Editor** を開く
4. このプロジェクトに含まれる `supabase/migrations/0001_init.sql` の中身を全てコピーし、SQL Editorに貼り付けて **Run** を実行する
   - これで `categories` / `tasks` / `habits` / `habit_records` の4テーブル、Row Level Security（RLS）のポリシー、新規登録時に初期カテゴリを自動作成するトリガーが全て作成されます
5. 左メニューの **Authentication → Providers** で「Email」が有効になっていることを確認
   - 開発中に確認メールの受信が面倒な場合は、**Authentication → Providers → Email** の中の「Confirm email」をオフにすると、登録直後にログインできるようになります（本番運用時は再度オンにすることをおすすめします）
6. 左メニューの **Settings → API** を開き、以下の2つの値をメモする
   - `Project URL`
   - `anon public` キー

### 手順B: 環境変数を設定する

1. `life-manager` フォルダ内の `.env.local.example` を `.env.local` という名前でコピーする
2. `.env.local` を開き、手順Aでメモした値を入力する

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=あなたのanon publicキー
```

### 手順C: 依存パッケージをインストールして起動する

ターミナル（Mac: ターミナル.app / Windows: PowerShellなど）で `life-manager` フォルダに移動し、以下を順番に実行してください（事前に [Node.js](https://nodejs.org/) 18.18以上のインストールが必要です）。

```bash
cd life-manager
npm install
npm run dev
```

`npm run dev` を実行すると、ターミナルに `http://localhost:3000` と表示されます。ブラウザでアクセスすると、自動的にログイン画面（`/login`）にリダイレクトされます。

「新規登録」から自分のメールアドレスとパスワードでアカウントを作成すれば、すぐに使い始められます。新規登録すると、7つの初期カテゴリ（就職活動・英語・資格・大学・研究・アルバイト・運動・健康・趣味・その他）が自動的に作成されます。

### 手順D: 型チェック（任意）

念のため以下も実行して、TypeScriptエラーが出ないか確認してください。

```bash
npm run typecheck
npm run lint
```

もしエラーが出た場合は、そのエラーメッセージをそのままこの会話に貼り付けてください。すぐに修正します。

---

## 4. Vercelへの公開方法

1. このプロジェクトをGitHubリポジトリにpushする（GitHub Desktopや `git init && git add . && git commit -m "init" && git push` など）
2. https://vercel.com にアクセスし、GitHubアカウントでログイン
3. 「Add New... → Project」から、pushしたリポジトリを選択してインポート
4. 「Environment Variables」の設定画面で、`.env.local` と同じ内容を登録する
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. 「Deploy」をクリックすれば数分でデプロイが完了し、`https://your-project.vercel.app` のようなURLでアプリにアクセスできるようになります
6. Supabase側の **Authentication → URL Configuration** で、Site URLとRedirect URLsに、発行されたVercelのURLを追加しておいてください（メール確認リンクなどが正しく機能するようになります）

以降はGitHubにpushするたびに自動で再デプロイされます。

---

## 5. 作成した機能一覧

**認証**
- 新規登録・ログイン・ログアウト（Supabase Auth / メール & パスワード）
- Cookieベースのセッション維持、未ログイン時は自動的にログイン画面へリダイレクト
- Row Level Securityにより、ログインユーザーは自分のデータのみ閲覧・編集可能

**ToDo管理**
- タスクの作成・編集・削除・完了切り替え（CRUD）
- タイトル・詳細説明・カテゴリ・優先度（High/Medium/Low）・期限・ステータス・作成日時・完了日時を管理
- キーワード検索、期限（今日まで/明日まで/今週まで/期限なし/期限切れ）・カテゴリでの絞り込み
- 期限順・優先度順・作成日順・タイトル順の並び替え
- 期限切れタスクは赤系の配色で強調表示

**カテゴリ管理**
- 就職活動・英語・資格・大学・研究・アルバイト・運動・健康・趣味・その他の初期カテゴリを自動作成
- 設定画面から自由にカテゴリを追加・削除可能（削除してもタスクは「未分類」になり消えません）
- カテゴリごとの達成率をリアルタイムに表示

**習慣管理**
- 習慣の登録（毎日/毎週・週の目標回数・カラー）
- ワンタップでの達成チェック
- 連続達成日数（ストリーク）の自動計算・表示
- 直近35日間の達成履歴をヒートマップ風に表示

**カレンダー**
- 月間カレンダーで、期限付きタスク・完了日・習慣達成日をまとめて可視化
- 日付をタップすると、その日のタスク・習慣達成の詳細を表示

**ダッシュボード**
- 今日の概要（今日のタスク数・完了数・達成率）
- 成長状況（連続達成日数・総完了タスク数・今週の達成率）
- 分析グラフ（カテゴリ別達成率・週間達成推移・月間達成推移）

**設定**
- アカウント情報の表示・ログアウト
- カテゴリ管理

**通知への拡張性**
- 現時点ではブラウザ通知・メール通知の実装はしていませんが、期限切れ判定ロジック（`src/lib/date-utils.ts`）とタスク/習慣の状態管理が分離された設計になっているため、将来的に「Vercel Cron + Supabase Edge Functions」や「Web Push API」を追加しやすい構造にしています。

---

## 6. 使用技術一覧

| 分野 | 技術 |
|---|---|
| フロントエンド | Next.js 15 (App Router) / React 19 / TypeScript |
| スタイリング | Tailwind CSS / shadcn/ui相当の自作UIコンポーネント（Radix UI ベース） |
| グラフ | Recharts |
| 日付処理 | date-fns |
| バリデーション | Zod |
| バックエンド | Supabase（PostgreSQL / Supabase Auth / Row Level Security） |
| デプロイ | Vercel |

---

## 7. ファイル構成

```
life-manager/
├── middleware.ts                # 認証セッションの更新・未ログイン時のリダイレクト
├── supabase/
│   └── migrations/0001_init.sql # テーブル定義・RLSポリシー・初期カテゴリ作成トリガー
└── src/
    ├── app/
    │   ├── (auth)/               # ログイン・新規登録（未ログイン時のレイアウト）
    │   │   ├── login/
    │   │   ├── signup/
    │   │   └── actions.ts        # ログイン/登録/ログアウトのServer Actions
    │   ├── (app)/                 # ログイン後のレイアウト（下部タブナビゲーション付き）
    │   │   ├── dashboard/
    │   │   ├── tasks/             # 画面 + Server Actions (CRUD)
    │   │   ├── habits/            # 画面 + Server Actions (CRUD)
    │   │   ├── calendar/
    │   │   └── settings/          # 画面 + Server Actions (カテゴリ管理)
    │   └── layout.tsx / globals.css
    ├── components/
    │   ├── ui/                    # Button, Card, Dialog, Select などの基本UI部品
    │   ├── layout/                 # 下部ナビゲーション、ページヘッダー
    │   ├── dashboard/               # 統計カード、グラフ
    │   ├── tasks/ / habits/ / calendar/ / settings/ / shared/ / auth/
    └── lib/
        ├── supabase/               # ブラウザ/サーバー/ミドルウェア用Supabaseクライアント
        ├── types.ts                # Supabaseテーブルの型定義
        ├── stats.ts                # ダッシュボード集計ロジック
        ├── habit-utils.ts          # ストリーク計算ロジック
        ├── date-utils.ts           # 期限判定などの日付ユーティリティ
        └── constants.ts            # 優先度・期限フィルタなどの定数
```

---

## 8. 今後追加できる機能（アイデア）

- プッシュ通知・メール通知（期限前リマインド、未完了タスクの通知）
- タスクのドラッグ&ドロップによる自由な並び替え
- ダークモード切り替えUI（CSS変数は既に用意済みのため、切り替えボタンを追加するだけで対応可能）
- Supabase Storageを使ったタスクへの画像添付
- 週次・月次の振り返りレポートの自動生成
- 複数デバイス間でのリアルタイム同期（Supabase Realtimeを有効化するだけで対応可能な設計にしてあります）
- ホーム画面への追加（PWA化）のためのアイコン画像追加

---

## 9. 困ったときは

- 画面が真っ白/エラーが出る → まずはターミナルのエラーメッセージを確認し、そのまま貼り付けて質問してください
- ログインできない → Supabaseの「Confirm email」設定と、`.env.local` の値が正しいか確認してください
- データが表示されない → Supabaseの SQL Editor で `0001_init.sql` が正しく実行されているか、Table Editorで `categories` などのテーブルが作成されているか確認してください
