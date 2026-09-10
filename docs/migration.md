# 移行ガイド: yarn + Pages Router 環境から乗り換える

以前 `dango` を `yarn` で環境構築していた人向けの手順です。教材のベースが大きく変わったので、上から順に実行してください。

## 何が変わったか

| 項目 | 旧 | 新 |
| --- | --- | --- |
| パッケージマネージャ | yarn (Berry) | pnpm |
| Node/pnpmのバージョン管理 | 各自の環境任せ | [mise](https://mise.jdx.dev/) でリポジトリ内に固定 |
| ルーティング | Pages Router (`src/pages/`) | App Router (`src/app/`) |
| Next.js | 14.x | 16.x |
| React | 18.x | 19.x |
| TypeScript | 5.x | 6.x |
| Tailwind CSS | 3.x (`tailwind.config.ts`) | 4.x (CSSファイルで`@import`) |
| Linter/Formatter | ESLint | [Biome](https://biomejs.dev/) |

## 1. mise をインストールする

Node.js と pnpm のバージョンは `mise.toml` にリポジトリで固定してあります。各自でNode/pnpmを個別インストールする必要はありません。

### macOS / Linux

```
curl https://mise.run | sh
```

インストール後、シェルの設定（`.zshrc` など）に以下を追加してターミナルを再起動してください。

```
eval "$(mise activate zsh)"
```

`bash` を使っている場合は `mise activate bash` にしてください。

### Windows

PowerShell を開いて、以下のどちらかでインストールします。

**方法1: winget を使う場合（まずはこちらを試してください）**

Windows 11、および最近のWindows 10には winget が標準で入っています。

```powershell
winget install jdx.mise
```

`winget : 用語 'winget' は... 認識されません` のようなエラーが出た場合は、winget自体が入っていません。[Microsoft Store の「App Installer」](https://apps.microsoft.com/detail/9nblggh4nns1) をインストールしてから、もう一度実行してください。

**方法2: Scoop を使う場合**

Scoop は最初から入っていないので、先にScoop自体をインストールする一手間が必要です（その代わり、mise用のシムへのPATH追加まで自動でやってくれます）。

```powershell
irm get.scoop.sh | iex
scoop install mise
```

---

どちらかの方法でインストールできたら、miseが管理するnode/pnpm/ghなどのコマンドにPATHを通します（**Scoopでインストールした場合はすでに自動で設定されているので、この手順は不要です**）。

1. PowerShellで以下を実行し、出力される `dirs:` の `shims:` に表示されたパスをメモする
    ```powershell
    mise doctor
    ```
    例: `C:\Users\ユーザー名\AppData\Local\mise\shims`
2. スタートメニューで「環境変数」と検索し、「環境変数を編集」（アカウントの環境変数を編集する）を開く
3. 「〇〇のユーザー環境変数」の一覧から `Path` を選んで「編集」をクリック
4. 「新規」をクリックし、1でメモしたパスを追加する
5. 「OK」を押してすべて閉じ、開いているPowerShell・VS Codeをすべて完全に閉じてから開き直す

> コマンドプロンプト（`cmd.exe`）ではなく **PowerShell** を使ってください。VS Codeのターミナルもデフォルト設定でPowerShellになっているはずです。

### 共通: インストール確認

ターミナルを開き直した後、以下でバージョンが表示されればOKです。

```
mise --version
```

## 2. 古い環境を掃除する

`dango` のディレクトリで以下を実行し、yarn時代の成果物を削除します。

**macOS / Linux**

```
rm -rf node_modules .next out .yarn
rm -f yarn.lock
```

**Windows (PowerShell)**

```powershell
Remove-Item -Recurse -Force node_modules, .next, out, .yarn -ErrorAction SilentlyContinue
Remove-Item -Force yarn.lock -ErrorAction SilentlyContinue
```

`yarn.lock` や `.yarnrc.yml` はリポジトリからもすでに削除済みなので、`git pull` すれば手元からも消えます。

## 3. 最新化した内容を取り込む

```
git checkout main
git pull
```

### upstream リモートがあるか確認する

各課題の`docs/`には、サンプルの更新を取り込むために`git fetch upstream && git merge upstream/main`を実行する手順が書かれています。この`upstream`は本来[docs/setup.md](setup.md)の`gh repo fork jamashita/dango --clone`を使うと自動で設定されるリモートです。しかし`yarn`時代に別の方法（GitHubの画面からForkして`git clone`する、など）で環境を作った人は設定されていないことがあります。`gh`コマンドがインストールされていなくても以下の方法で追加できるので、このタイミングで確認しておいてください。

1. 以下を実行し、`upstream`という行が表示されるか確認する
    ```
    git remote -v
    ```
2. 表示されない場合は、以下を実行して追加する（`gh`は不要です）
    ```
    git remote add upstream git@github.com:jamashita/dango.git
    ```
3. もう一度`git remote -v`を実行し、`upstream`が`fetch`・`push`両方の行に表示されればOKです

`upstream`が確認できたら、このタイミングで一度実行して最新化しておきましょう。

```
git fetch upstream
git merge upstream/main
```

これで以降も、各課題のdocsに書かれている`git fetch upstream && git merge upstream/main`がそのまま使えるようになります。

## 4. mise でツールを揃える

`dango` ディレクトリ内で実行してください（`mise.toml` を検出して初回は信頼確認が入ります）。

```
mise trust
mise install
```

`node -v` と `pnpm -v` が `mise.toml` に書かれているバージョンになっていれば成功です。

## 5. 依存パッケージをインストールする

```
pnpm install
```

## 6. コマンドの対応表

| やりたいこと | 旧 (yarn) | 新 (pnpm) |
| --- | --- | --- |
| 依存インストール | `yarn` / `yarn install` | `pnpm install` |
| 開発サーバー起動 | `yarn dev` | `pnpm dev` |
| ビルド | `yarn build` | `pnpm build` |
| 本番起動 | `yarn start` | `pnpm start` |
| テスト | `yarn test` | `pnpm test` |
| フォーマット/lint | `yarn format` | `pnpm format` / `pnpm lint` |
| パッケージ追加 | `yarn add <pkg>` | `pnpm add <pkg>` |
| 開発用パッケージ追加 | `yarn add -D <pkg>` | `pnpm add -D <pkg>` |

## 7. コードの置き場所が変わっている

- `src/pages/index.tsx` は廃止され、以下に分割されました。
  - `src/app/page.tsx` … サーバー側で `countries.json` を読み込む Server Component
  - `src/components/samples/HomeView.tsx` … ボタンやフォームなど、画面上で状態を持つ部分（`'use client'`）
- `src/pages/_app.tsx` → `src/app/layout.tsx`（共通レイアウト、`globals.css` の読み込みもここ）
- `src/pages/404.tsx` → `src/app/not-found.tsx`
- 新しいページを作るときは `src/pages/xxx.tsx` ではなく `src/app/xxx/page.tsx` を作成してください。

## 8. 自分でつくった課題のページを移行する

すでに `src/pages/xxx.tsx` として自分の課題（電卓など）を実装していた人向けの手順です。

`upstream` の更新を取り込む（各課題の docs に書いてある `git fetch upstream && git merge upstream/main`）と、`jamashita/dango` 側ではすでに `src/pages/` が削除済みなので、あなたの手元でも `index.tsx` ・ `_app.tsx` ・ `404.tsx` は自動的に消えます。

一方で、あなたが自分で追加した `src/pages/calculator.tsx` のようなファイルは upstream 側に存在しないため、merge しても消えずにそのまま残ります。そして同時に `src/app/calculator/page.tsx` という新しい（中身が空の）ファイルが増えているはずです。

このままだと同じ機能のファイルが2つ存在してしまいます。App Router 側が優先して表示されるので、古い `src/pages/calculator.tsx` は「動いているように見えて実はもう使われていない」状態になります。以下の手順で中身を移してください。

1. `src/app/calculator/page.tsx`（新しい方、まだ中身が空）を開く
2. `src/pages/calculator.tsx`（自分が書いたコード）の中身を確認する
3. 以下の3点を直しながら、ロジックを新しいファイルにコピーする
    - ファイルの一番上に `'use client';` を追加する（`useState` や `onClick` を使っているページなら必要です）
    - `import { NextPage } from 'next';` と `NextPage` 型は使いません。`const CalculatorPage = (): ReactElement => { ... };` のように書いてください
    - importのパスを直す。`src/pages/calculator.tsx` から見た `../components/Button` は、`src/app/calculator/page.tsx` から見ると1階層深くなるため `../../components/Button` になります
4. `pnpm dev` でブラウザから動作を確認する
5. 問題なければ古いファイルを削除する。`src/pages` フォルダの中が空になったら、フォルダごと削除して構いません

```
rm src/pages/calculator.tsx
```

(補足) `getStaticProps` などでデータを読み込んでいた人は、`src/app/page.tsx` + `src/components/samples/HomeView.tsx`（トップページ）や `src/app/search/`（`#5`）の構成を参考にしてください。データを読み込む部分はサーバー側の `page.tsx` に、画面や状態を持つ部分はクライアント側のファイル（`'use client'`）に分ける必要があります。

## 9. Tailwind CSS の書き方が変わっている

- `tailwind.config.ts` は廃止しました。デフォルト設定のままだったため、v4では設定ファイル自体が不要です。
- スタイルの起点は `src/styles/globals.css` の `@import 'tailwindcss';` です。クラス名（`bg-cyan-600` など）の使い方自体は変わっていません。

## 10. エディタの Biome 拡張について

このリポジトリでは ESLint の代わりに [Biome](https://biomejs.dev/) をフォーマッタ/リンタとして使っています。VS Code の場合は拡張機能タブから `Biome`（`biomejs.biome`）をインストールしてください。`.vscode/settings.json` で保存時フォーマット・自動修正を有効にしてあるので、拡張を入れれば追加設定なしで保存するたびに整形・lintが走ります。

ESLint 拡張を有効にしている場合は「設定が見つからない」という警告が出ることがありますが、動作に影響はないので無視して問題ありません。気になる場合はこのワークスペースだけ ESLint 拡張を無効化してください。

## うまくいかないときは

- `pnpm install` でエラーが出る → `node -v` / `pnpm -v` が `mise.toml` の値と一致しているか確認してください（`mise install` をやり直す）。
- `node -v` / `pnpm -v` が `mise.toml` の値と一致しない、かつ以前 [Volta](https://volta.sh/) で Node をインストールしたことがある → Voltaが干渉している可能性があります。以下の手順でVoltaを消してください。

    1. 入っているか確認する
        ```
        volta --version
        ```
        コマンドが見つからなければVoltaは入っていないので、この項目は無視してOKです。

    2. アンインストールする

        **macOS / Linux**
        ```
        rm -rf ~/.volta
        ```
        続けて `~/.zshrc`（`bash`の場合は `~/.bashrc` や `~/.bash_profile`）を開き、以下のような行が残っていれば削除してください。
        ```
        export VOLTA_HOME="$HOME/.volta"
        export PATH="$VOLTA_HOME/bin:$PATH"
        ```

        **Windows**

        設定アプリの「アプリと機能」（または「プログラムの追加と削除」）から `Volta` を検索してアンインストールしてください。インストーラー経由でPATHや環境変数も自動的に片付きます。

    3. ターミナルを再起動し、`node -v` が `mise.toml` の値と一致すれば完了です。
- 画面が真っ白 / 古いページが表示される → `.next` を消してから `pnpm dev` をやり直してください（macOS/Linux: `rm -rf .next` / Windows: `Remove-Item -Recurse -Force .next`）。
- それでも解決しない場合は `node_modules` ごと消して `pnpm install` からやり直してください。
