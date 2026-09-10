# Dango

This is your story.
Hello World!

> 以前 yarn で環境構築していた人は [docs/migration.md](docs/migration.md) を先に読んでください。

## Setup Node.js and pnpm

Node.js と pnpm のバージョンは [mise](https://mise.jdx.dev/) で管理しています。

**macOS / Linux**

```
curl https://mise.run | sh
eval "$(mise activate zsh)"   # bashの場合は mise activate bash
```

**Windows (PowerShell)**

```powershell
winget install jdx.mise
echo '(&mise activate pwsh) | Out-String | Invoke-Expression' >> $HOME\Documents\PowerShell\Microsoft.PowerShell_profile.ps1
```

`winget`が認識されない場合や詳しい手順は [docs/migration.md](docs/migration.md) の「1. mise をインストールする」を参照してください。

インストールしてターミナルを開き直したら、リポジトリのルートで以下を実行してください。

```
mise install
```

## Install dependencies

```
pnpm install
```

## Run in development mode

```
pnpm dev
```

## Build for production

```
pnpm build
```

## Run tests

```
pnpm test
```
