# #6 カウントダウンタイマーを作ろう

秒数を入力してスタートすると、1秒ずつ減っていくカウントダウンタイマーを作ろう。`#7 API通信をしてみよう`で`useEffect`を本格的に使う前に、ここで「時間が経ったら何かする」という副作用（`useEffect`のクリーンアップ）の扱いに慣れておきます。

## サンプル

<https://github.com/jamashita/dango>

## 完成例

<https://vctms.jamashita.dev/timer>

## ページ

`src/app/timer/page.tsx`をあらかじめ用意してあります。`pnpm dev`した状態で<http://localhost:3000/timer>にアクセスすると「カウントダウンタイマーをここに作ろう」とだけ表示されるはずです。このファイルの中身を書き換えて実装していきます。ページ自体の作りかたを忘れた場合は`docs/02-calculator.md`を見返してください。

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

1. 秒数を数字で入力できること（例: `60`）
2. 「スタート」ボタンを押すと、1秒ごとに残り秒数が1ずつ減っていくこと
3. 残り秒数が0になったら自動的に止まること
4. 「ストップ」ボタンを押すとカウントダウンを一時停止できること（もう一度「スタート」を押すと、止めたところから再開すること）
5. 「リセット」ボタンを押すと、入力した秒数に戻ること
6. (できれば) 残り時間を`分:秒`の形式（例: `01:05`）で表示すること

## 注意するところ

- 「1秒ごとに何かする」を実現するには`setTimeout`（または`setInterval`）を使いますが、`useEffect`の中で予約したタイマーは、片付け（クリーンアップ）を書かないと画面が再描画されるたびに新しいタイマーが増えていき、カウントダウンがどんどん速くなるバグになります
    - `setTimeout`と`useEffect`のクリーンアップを組み合わせて1秒ごとに数字が変わる書き方は`src/components/samples/Stopwatch.tsx`にサンプルがあります。読んで参考にするのはOKですが、トップページ(`/`)にそのまま表示されているファイルなので直接編集しないでください。スタート/ストップやカウントダウン（減っていく方向）はこのサンプルには入っていないので、要件を見ながら自分で実装してください
- 今スタート中かどうかを表すstate（例: `isRunning`）を用意しておくと、「スタート/ストップの切り替え」や「0になったら止める」処理が書きやすくなります
- 秒数が0未満にならないようにすること
- 入力欄の秒数が不正な値（空文字や負の数、小数など）のときはスタートできないようにすること。判定の考え方は`#4 座席を決めよう`の`isPositiveInteger`と同じです

## 考えなくていいこと

- ミリ秒単位の正確さは考えなくて大丈夫です（多少のずれは気にしなくてOK）
- 音を鳴らす、通知を出すといった演出は不要です

## 学習の意図

### `useEffect`のクリーンアップ関数を理解する

`useEffect`は第2引数の依存配列（`[]`の中身）に入れた値が変わるたびに実行されます。さらに、`useEffect`の中で関数を`return`すると、その関数は「次に`useEffect`が実行される直前」と「コンポーネントが画面から消えるとき」に自動で呼ばれます。これがクリーンアップ関数です。

```typescript=
useEffect(() => {
  if (!isRunning || seconds <= 0) {
    return;
  }

  const timeoutId = setTimeout(() => {
    setSeconds(seconds - 1);
  }, 1000);

  return () => {
    clearTimeout(timeoutId);
  };
}, [isRunning, seconds]);
```

この書き方のポイントは以下の通りです。

- `seconds`が変わるたびにこの`useEffect`が実行され、「1秒後に`seconds`を1減らす」タイマーを1つだけ予約する
- `seconds`が変わって次にこの`useEffect`が実行される直前に、クリーンアップ関数（`clearTimeout(timeoutId)`）が呼ばれ、直前に予約したタイマーを消してから新しいタイマーを予約し直す
- もしクリーンアップを書き忘れると、古いタイマーが消えないまま新しいタイマーが増え続け、`seconds`が実際より速く減っていくバグになります
- `isRunning`が`false`、または`seconds`が`0`以下のときは`return`だけしてタイマーを予約しない。これだけで「ストップボタンで止まる」「0になったら自動的に止まる」の両方が実現できます

### 数値の入力を扱う（要件1, 注意するところ）

秒数の入力チェックは`#4 座席を決めよう`で出てきた`isPositiveInteger`と同じ考え方で書けます。

```typescript=
const isPositiveInteger = (value: string): boolean => {
  const num = Number(value);

  return Number.isInteger(num) && num > 0;
};
```

### `分:秒`の形式で表示する（要件6、できればの部分）

秒数を分と秒に分けるには、割り算のあまり（`%`）を使います。

```typescript=
const minutes = Math.floor(seconds / 60);
const restSeconds = seconds % 60;
```

`restSeconds`が1桁のとき（例: `5`）に`01:5`のようにならないよう、2桁に揃えたい場合は`padStart`が使えます。

```typescript=
const display = `${`${minutes}`.padStart(2, '0')}:${`${restSeconds}`.padStart(2, '0')}`;
```
