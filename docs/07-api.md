# #7 API通信をしてみよう

いろんな方法でAPI通信をしてみよう。

## サンプル

<https://github.com/jamashita/dango>

## 完成例

<https://vctms.jamashita.dev/cat>

## ページ

`src/app/cat/page.tsx`をあらかじめ用意してあります。`pnpm dev`した状態で<http://localhost:3000/cat>にアクセスすると「ねこ画像をここに表示しよう」とだけ表示されるはずです。このファイルの中身を書き換えて実装していきます。

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

1. 読み込み時にねこの画像が表示されること
2. ボタンを押すとねこの画像が表示されること

## 注意するところ

通信のしかたに慣れてもらうことが主目的なので、考える部分は少ないので安心してください。

## 学習の意図

### (React) `useEffect` を理解する

第2引数の配列に入っている変数が変更されると処理が走るという動作を学ぶ。第2引数が空の配列であれば初期化時に1度実行されるということも学ぶ。

```typescript=
useEffect(() => {
  // させたい処理
}, []);
```

`useEffect` の内部では `async/await` を使えないことを覚えておかないといけない。

### `Promise<T>` を理解する

`Promise<T>` 型は **まだその結果の `T` 型が得られていないが、そのうち手に入る** といった非同期的に結果が手に入ることを示している。この結果を待つためには `async` 関数内では `await` を先頭に、または `then()` メソッドで結果を取得する。

```typescript=
const promise: Promise<number> = fetchNumber(); // 例えば
const num: number = await promise; // awaitによってPromiseが外れる
```

これを `then()` で書き換えると

```typescript=
const promise: Promise<number> = fetchNumber(); // 例えば

promise.then((num: number) => {
  // numはここで使用できる
});
```


### `fetch` を理解する

fetchを使ってAPIサーバーと通信をする。戻り値は `Response` でこの戻り値をJSONにパース(変形)する必要がある。
厳密な戻り値は `Promise<Response>` であり、非同期処理を学ぶ必要がある。
基本的には `Promise<T>` は `async` の関数内では `await` を先頭につけることによって `T` を取り出すことができる
`async` にできない場合やしたくない場合は `then()` のメソッドを後ろにつけると `T` を取り出すことができる。

つまり `async` 関数内部のこれと

```typescript=
const response: Response = await fetch('https://api.thecatapi.com/v1/images/search');
const json: unknown = await response.json();

console.log(json);
```

これは同じ。

```typescript=
fetch('https://api.thecatapi.com/v1/images/search').then((response: Response) => {
  return response.json();
}).then((json: unknown) => {
  console.log(json);
});
```

### 実装する上で考えること

- 要件1（読み込み時に表示）は`useEffect`の第2引数を空配列`[]`にすれば満たせますが、要件2（ボタンを押しても表示）のためには、ボタンの`onClick`からも同じ通信処理を呼び出す必要があります。通信する処理を`useEffect`の中に直接書いてしまうとボタン側から呼び出せないので、通信する処理を関数として切り出し、`useEffect`と`onClick`の両方からその関数を呼ぶようにするとよいです
- `https://api.thecatapi.com/v1/images/search`は配列（`[{...}]`）を返します。1匹分のデータを取り出すには`json[0]`のように配列の0番目を取り出す必要があります
- 取り出したデータの型は`src/lib/Types.ts`にある`RandomCat`型（`id`, `url`, `width`, `height`を持つ）が使えます。`unknown`型のままでは`<img src={...}>`に渡せないので、`json as Array<RandomCat>`のように型をつけてあげましょう
- 実際に画像を表示する`<img>`タグは自分で書かなくても、`src/components/CatImage.tsx`という再利用可能な部品が用意されています。`cat`という`null | RandomCat`型のpropsを受け取り、`null`なら何も表示せず、値があれば画像を表示してくれます。`#1`の`Button.tsx`と同じように、そのままimportして使ってよい部品です
    ```typescript=
    import { CatImage } from '../../components/CatImage';
    ```
- `useEffect`を使ってページを開いたときに1回通信する書き方は`src/components/samples/CatImageFetcher.tsx`に近いサンプルがあるので読んで参考にしてください。ただしこれは要件1（読み込み時の表示）のみのサンプルで、トップページ(`/`)にそのまま表示されているファイルなので直接編集しないでください