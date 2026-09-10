# #0 カウンターを作ろう

プログラミングが初めての人のためのウォームアップ課題です。ボタンを押すと数字が増減するだけの、小さなカウンターを作ってみよう。`#1`以降の課題で必要になる基本を、ここで少しずつ確認します。

## サンプル

<https://github.com/jamashita/dango>

## 完成例

<https://vctms.jamashita.dev/counter>

## ページ

`src/app/counter/page.tsx`をあらかじめ用意してあります。`pnpm dev`した状態で<http://localhost:3000/counter>にアクセスすると「カウンターをここに作ろう」とだけ表示されるはずです。このファイルの中身を書き換えて実装していきます。

### upstreamの更新を取り込む

`docs/setup.md`の手順で`gh repo fork jamashita/dango --clone`を使ってcloneした場合、コピー元の`jamashita/dango`を指す`upstream`というリモートが自動的に設定されています。サンプルが更新されているのでそれを取得しましょう。

```
git fetch upstream
git merge upstream/main
```

(補足) `git remote -v`を実行して`upstream`が表示されない場合は、以下を実行してから上のコマンドを試してください。

```
git remote add upstream git@github.com:jamashita/dango.git
```

その後、使用しているソフトウェアを最新化する

```
pnpm install
```

## 要件

1. 現在の数字を表示する場所があること
2. 「+1」ボタンを押すと表示が1増えること
3. 「-1」ボタンを押すと表示が1減ること
4. 「リセット」ボタンを押すと0に戻ること
5. (できれば) 数字が0未満にならないようにすること

## 考えなくていいこと

- 小数やマイナスの入力を考える必要はありません（ボタンで1ずつ増減するだけです）
- デザインを凝る必要はありません

## 注意するところ

`src/components/samples/SimpleCounter.tsx`に、この課題とほぼ同じ動きをするサンプルがあります。トップページ(`http://localhost:3000/`)にそのまま表示されているサンプルなので、**このファイル自体をimportしたり書き換えたりしないでください**（書き換えるとトップページの見た目も変わってしまいます）。コードを読んで、同じような書き方を`src/app/counter/page.tsx`に書いてください。

## 学習の意図

### Next.jsを理解する
ページの追加のしかた

- `src/app`の中に、URLにしたい名前のフォルダを作り、その中に`page.tsx`という名前のファイルを置く
    - `src/app/counter/page.tsx`というファイルを作ったら
    `http://localhost:3000/counter`というURLになる
- ボタンを押したら表示が変わるページなので、ファイルの一番上に`'use client';`という1行を書く必要がある
    - これを書くと「ブラウザ側で動くページ」になり、`useState`やボタンの`onClick`が使えるようになる
- `page.tsx`は`export default`を使う必要がある

### 変数を理解する

1. `let`
2. `const`

`let`を使うと変数を宣言できる(書き換え可能)
`const`を使うと定数を宣言できる(書き換え不可能)

変数、定数は好きな名前を使ってもよいが、数字で始めることはできない。

### 変数の型を理解する

まずは`number`型（数値, 例: `0`, `1`, `100`）だけ覚えれば十分です。文字列(`string`型)や真偽値(`boolean`型)は次回の`#1 暗証番号ロックを作ろう`以降で登場します。

### 四則演算をする

`number`型同士の計算ができる。

- `+` ... 足し算
- `-` ... 引き算

今回使うのはこの2つだけです。

### 関数

同じ処理を何度も書きたくないときは関数にまとめます。書き方はいくつかありますが、React.jsでよく使われる、以下の書き方だけ覚えておけば十分です。

```typescript=
const increment = (): void => {
  // ここに処理を書く
};
```

`(): void`の`void`は「この関数は値を返さない」という意味です。値を返す関数を書きたくなったら`#1`で改めて説明します。

### 値を記憶する場所を用意する（`useState`）

`useState<TYPE>(INITIAL_VALUE)`を使うと、値を保存できる場所（state）を用意できます。

```typescript=
const [count, setCount] = useState<number>(0);
```

- `TYPE`は型。今回は`number`
- `INITIAL_VALUE`は初期値。今回は`0`
- `count`が現在の値、`setCount`が値を更新するための関数です

### 値を更新する

`count`を直接書き換えることはできません。必ず`setCount`（`useState`と一緒に生まれたセッター）を使います。

```typescript=
const increment = (): void => {
  setCount(count + 1);
};
```

これをボタンの`onClick`に渡せば、ボタンを押すたびに`count`が1増えていきます。

```typescript=
<button type="button" onClick={increment}>
  +1
</button>
```

### `if`（(できれば)の部分で使います）

`if`のあとのカッコの中身の内容が正しければそのあとの`{}`を実行、そうでなければ実行しない。

```typescript=
if (count > 0) {
  setCount(count - 1);
}
```

このように「実行してよい条件」を`if`で先に確認してから`setCount`を呼ぶことで、「0未満にはしない」を実現できます。
