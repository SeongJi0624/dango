# #3 勤務時間を管理しよう

フォームを使って勤務時間を管理しよう。
フォームが必要です。

## サンプル

<https://github.com/jamashita/dango>

## 完成例

<https://vctms.jamashita.dev/labour>

## ページ

`src/app/labour/page.tsx`をあらかじめ用意してあります。`pnpm dev`した状態で<http://localhost:3000/labour>にアクセスすると「勤務時間管理をここに作ろう」とだけ表示されるはずです。このファイルの中身を書き換えて実装していきます。ページ自体の作りかたを忘れた場合は`docs/02-calculator.md`を見返してください。

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

1. 勤務開始時間と勤務終了時間の入力があると勤務時間を計算すること
2. 勤務開始時間と勤務終了時間は24時間制で入力できること
    - (午前午後はなく、13時などの入力のこと)
4. 1時1分を意味する入力は01:01であること
    - 入力に応じてすぐに計算されること
5. 不正な入力がされている間は計算しないこと
6. (高難易度)休憩時間を入力できること
7. (高難易度)休憩時間を複数入力できること
    - ボタンを押すと休憩時間の入力欄を増やしたり、減らしたりできること
    - 休憩時間は勤務時間の範囲内であること
    - 休憩時間の合計は勤務時間を超えないこと
    - 不正な入力の休憩時間は計算に使用しないこと
    - (超高難易度)休暇の時間が被った場合は計算に使用しないこと
    - 合計の勤務時間を出力できること

## 注意するところ

- 休憩時間を入力できるようにするためには休憩時間の開始時間、終了時間を入力できるフォームがさらに必要です
- 休憩時間を複数入力できるようにするためにはそれらをさらに配列で管理することが必要です
    - 「配列のstateに要素を追加・削除する」具体的な書き方は今回はまだ扱いません。挑戦したい人は「#4 座席を決めよう」の「配列の要素を増やす・減らす」を先に読んでみてください

## 学習の意図

### 配列を理解する

配列とは同じデータをまとめたもの。`string[]`型であれば`string`型をまとめて持つことができることを意味している。他にも`number[]`型などなんでもある。

- 保持しているデータの`i`番目を参照することができるが、1番目のデータは`i = 0`なので注意。
- データが入っていない`i`番目を参照すると`undefined`が返ってくるので注意

```typescript=
const octave: string[] = ['ド', 'レ', 'ミ', 'ファ', 'ソ', 'ラ', 'シ'];

console.log(octave[0]); // 'ド'
console.log(octave[1]); // 'レ'
console.log(octave[2]); // 'ミ'
console.log(octave[3]); // 'ファ'
console.log(octave[4]); // 'ソ'
console.log(octave[5]); // 'ラ'
console.log(octave[6]); // 'シ'
console.log(octave[7]); // undefined
```

### 文字列から数値の計算をできるようにする

`xx:yy`と入力された文字列を`xx`と`yy`に分割するには`split()`を使う。結果は`string[]`型という、配列で返ってくる。

```typescript=
const hoursAndMinutes = '1:23'.split(':');

console.log(hoursAndMinutes[0]); // '1'
console.log(hoursAndMinutes[1]); // '23'
```

### 入力が正しい時刻かどうかを判定する（要件5）

「不正な入力がされている間は計算しないこと」を満たすには、`split()`で分けた文字列が「時・分として正しい範囲の数値かどうか」を自分でチェックする必要があります。新しい構文は使わず、これまでに出てきた`split()`, `Number()`, `Number.isNaN()`, `if`だけで書けます。

```typescript=
const isValidTime = (value: string): boolean => {
  const parts = value.split(':');

  if (parts.length !== 2) {
    return false; // ':'で2つに分かれていない
  }

  const hour = Number(parts[0]);
  const minute = Number(parts[1]);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return false; // 数値に変換できない
  }

  if (hour < 0 || hour > 23) {
    return false; // 24時間制の範囲外
  }

  if (minute < 0 || minute > 59) {
    return false; // 分の範囲外
  }

  return true;
};
```

`isValidTime('13:30')`のように使い、`true`が返ってきたときだけ計算するようにすれば要件5を満たせます。

(補足) 要件4の「01:01のように入力する」を厳密にチェックしたい場合は、`parts[0].length === 2 && parts[1].length === 2`のような条件を追加してみてください（必須ではありません）。

### (Advanced) オブジェクトを理解する

(これを使わなくても今回の要件は満たせる可能性があります)

特定のデータをかたまりとして処理したい場合はオブジェクトを定義する。
TypeScriptでは`type`を使って定義できる。`type`は`import`と`IndexPage`の宣言の間でしたほうがよい。

```typescript=
type LabourHour = {
  start: string;
  end: string;
};
```

定義したらこの型を変数につけてあげれば、この型の通りに宣言ができるようになる

```typescript=
const hour: LabourHour = {
  start: '7:30',
  end: '18:30'
};
```

### 関数

今回の要件を満たすためには関数を使うのが楽だと思うので紹介。
関数は外から値を引数（ひきすう）として受けて戻り値を返す。例えば`LabourHour`型を受けて労働時間を分で返すならこんな感じの関数ができるはず。

```typescript=
const calculateLabourHour = (hour: LabourHour): number => {
  // do something
  return num; // numはnumber型
};
```