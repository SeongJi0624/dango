# #5 インクリメンタルサーチをしよう

フォームに入力すると即座に入力内容が絞られるインクリメンタルサーチをしよう。

## サンプル

<https://github.com/jamashita/dango>

## 完成例

<https://vctms.jamashita.dev/search>

## ページ

`src/app/search/`に2つのファイルをあらかじめ用意してあります。

- `page.tsx` … `json/countries.json`を読み込んで`IncrementalSearchView`に渡すだけのファイルです。今回は`countries`のデータをサーバー側で読み込む必要があるため、`#1`〜`#4`と違って`page.tsx`自体は`'use client'`にできません（データの読み込みは`fs`を使うため、ブラウザ側では動かせません）。このファイルは書き換える必要はありません
- `IncrementalSearchView.tsx` … 実際に検索フォームと結果一覧を作る、皆さんが書き換えるファイルです。`countries`という、国のデータが入った配列をpropsとして受け取っています

`pnpm dev`した状態で<http://localhost:3000/search>にアクセスすると「インクリメンタルサーチをここに作ろう（249件のデータを受け取っています）」のように表示されるはずです。件数が表示されていれば、データの受け渡しは正しくできています。

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

1. アルファベット名称でインクリメンタルサーチできること
2. 日本語名称でインクリメンタルサーチできること
3. alpha3, alpha2を利用してインクリメンタルサーチできること
    - (やや難しい)このとき検索結果に同じ国が表示されないようにすること
4. 入力している間だけではなく、削除時もインクリメンタルサーチできること

## 注意するところ

- 検索対象のデータは`countries`という配列で渡ってきます。中身の形（`jpnName`, `engName`, `alpha2`, `alpha3`など）は`src/lib/Types.ts`の`Country`型を見てください
- `src/components/samples/CountryList.tsx`に、この`countries`配列を`map`で一覧表示しているサンプルがあります。読んで参考にするのはOKですが、トップページ(`/`)にそのまま表示されているファイルなので直接編集しないでください
- 要件4（入力中も削除中も絞り込む）は、フォームの値をstateで管理して`return`のたびに絞り込み直していれば自然に満たせます。入力と削除を別々に処理する必要はありません

## 学習の意図

### 配列を絞り込む（`filter`）

配列の中から条件に合うものだけを取り出すには`filter()`を使う。渡した関数が`true`を返した要素だけが新しい配列に残る。

```typescript=
const numbers = [1, 2, 3, 4, 5];

const evenNumbers = numbers.filter((num) => num % 2 === 0);

console.log(evenNumbers); // [2, 4]
```

これを`countries`に対して使えば、入力した文字列を含む国だけに絞り込める。`string.includes()`は`#2 電卓をつくろう`で小数点の判定に使ったのと同じ関数です。

```typescript=
const [query, setQuery] = useState<string>('');

const filtered = countries.filter((country) => {
  return country.jpnName.includes(query);
});
```

- `query`が空文字`''`のときは、すべての文字列が`''`を含むと判定されるので`countries`全件が残ります（＝何も入力していないときは絞り込まれない、という動きになります）

### 複数の項目のどれかに一致したら残す

「アルファベット名称でも日本語名称でも検索できる」ようにするには、`||`（OR）で条件をつなげる。

```typescript=
const filtered = countries.filter((country) => {
  return country.jpnName.includes(query) || country.engName.includes(query);
});
```

要件3の「alpha3, alpha2を使うが同じ国を重複させない」もこの考え方で解決できます。`alpha2`と`alpha3`それぞれで`filter`を2回実行して結果をくっつけると、両方に一致した国が2回表示されてしまいます。1回の`filter`の中で`||`を使って両方をチェックすれば、1つの国は最大1回しか結果に含まれません。

```typescript=
const filtered = countries.filter((country) => {
  return country.alpha2.includes(query) || country.alpha3.includes(query);
});
```

### 絞り込んだ結果を画面に表示する（`map`と`key`）

`filtered`は配列なので、そのままでは画面に表示されません。中身をひとつずつHTML（JSX）に変換するには`map()`を使います。

```typescript=
<ul>
  {filtered.map((country) => {
    return (
      <li key={country.alpha2}>{country.jpnName}</li>
    );
  })}
</ul>
```

`<li>`に`key`という見慣れないpropsがついていますが、これはReactが「配列のどの要素がどのHTMLに対応しているか」を区別するために必須のものです。`key`には配列の中で重複しない値を渡す必要があるので、今回であれば国ごとに一意な`alpha2`（国名コード）がちょうどよいです。`key`を付け忘れると、ブラウザのコンソールに警告が出ます。

書き方自体は`src/components/samples/CountryList.tsx`でも同じように使われているので、参考にしてください（ここも直接編集はしないでください）。
