# #2電卓をつくろう

ボタンを使って電卓を作ろう。
ボタンで数字と、四則演算。そして結果表示をする場所が必要です。

> プログラミングが初めての人は、先に[docs/00-counter.md](00-counter.md)（カウンターを作ろう）と[docs/01-pin.md](01-pin.md)（暗証番号ロックを作ろう）をやってからこちらに進んでください。`let`/`const`や`useState`、`string`型・`boolean`型など、基本的な内容はそちらで説明しています。

## サンプル

<https://github.com/jamashita/dango>

## 完成例

<https://vctms.jamashita.dev/calculator>

## 要件

1. `0 - 9`の数字のボタンがあること
2. 四則演算(`+, -, *, /`)のボタンがあること
3. `=`があること
    - `=`が押されると結果表示されること
4. 小数点があること、小数計算もできること 
5. (デザインが)電卓の体をなしていること

## 注意するところ

- 数字のボタンを入力すると現在表示している数字の末尾にその数字が加わることになります。この計算をどのようにするかが実装の難関です
    - これはそれが整数なのか小数を含むのかで処理が分かれる可能性があります
- `0`で数字を割ることはできないため、そのときの処理が必要です
- 小数点を2個以上入力できないようにする処理が必要です
    - 表示中の文字列がすでに`'.'`を含んでいるかどうかを判定すればよいです（下の「ある文字が含まれることを判定する」を参照）
- 四則演算を2回入力されたときはどうする必要があるか考える必要があります

## 考えなくていいこと

- 計算誤差を考える必要はありません
- 電卓にある他の機能を考える必要はありません（余裕がある人は実装してみてください）

## 学習の意図

### Next.jsを理解する
ページの追加のしかた

電卓のページはあらかじめ`src/app/calculator/page.tsx`として用意してあります。`pnpm dev`した状態で<http://localhost:3000/calculator>にアクセスすると「電卓をここに作ろう」とだけ表示されるはずです。このファイルの中身を書き換えて電卓を実装していきます。

自分でこのファイルを消してしまった場合や、次回以降の課題で新しくページを作るときのために、仕組みも説明しておきます。

- `src/app`の中に、URLにしたい名前のフォルダを作り、その中に`page.tsx`という名前のファイルを置く
    - `src/app/calculator/page.tsx`というファイルを作ったら
    `http://localhost:3000/calculator`というURLになる
- 電卓はボタンを押したら表示が変わるページなので、ファイルの一番上に`'use client';`という1行を書く必要がある
    - これを書くと「ブラウザ側で動くページ」になり、`useState`やボタンの`onClick`が使えるようになる
- `page.tsx`は`export default`を使う必要がある（`src/components`にある部品ファイルとは書きかたが少し違うので注意）

最低限のページの骨組みは以下の通り。ボタンを押すたびに表示の末尾に文字をつなげている点に注目してください（数値の足し算ではありません）

```typescript=
'use client';

import { ReactElement, useState } from 'react';

const CalculatorPage = (): ReactElement => {
  const [display, setDisplay] = useState<string>('0');

  return (
    <button type="button" onClick={() => setDisplay(display + '1')}>
      {display}
    </button>
  );
};

export default CalculatorPage;
```

数字ボタンを押すたびに表示へ数字をつなげていく、という電卓に近い実装例は`src/components/samples/Counter.tsx`にあるので参考にしてください。これはトップページ(`http://localhost:3000/`)にそのまま表示されているサンプルなので、**このファイル自体をimportしたり書き換えたりしないでください**（書き換えるとトップページの見た目も変わってしまいます）。コードを読んで、同じような書き方を`src/app/calculator/page.tsx`に書いてください。

以下は`Counter.tsx`には入れていないので、要件を見ながら自分で実装してください。

- `+, -, *, /, =`のボタンと、それが押されたときの処理
- 小数点や`0`除算などの細かい処理

(補足) `Counter.tsx`の中の`DIGITS.map(...)`は、9個のボタンをまとめて作るための書き方です。`.map`がまだわからなければ、無理に使わず1個ずつ9回書いても問題ありません。

### React.jsを理解する

`src/components`にtsxのファイルを置く

- ボタンなど、他のページでも使い回したい部品はここに置く
- `src/components/Button.tsx`は電卓のボタンにもそのまま使えるので、`import { Button } from '../../components/Button';`のようにして使い回してもよい

### 変数を理解する

1. `let`
2. `const`

`let`を使うと変数を宣言できる(書き換え可能)
`const`を使うと定数を宣言できる(書き換え不可能)

変数、定数は好きな名前を使ってもよいが、数字で始めることはできない
今回に限れば`const`だけで良さそう。

### 変数の型を理解する

1. `number`型
2. `string`型
3. `boolean`型

`number`型は数値 (1, 2, 3)
`string`型は文字 ('a', 'b', 'c')

`string`型は文字をsingle quote`'`かdouble quote`"`かbacktick`` ` ``で囲む必要がある。
どれで囲んでもよいがbacktickのときは中で演算(数式に限らない)ができるという他とは違う特徴がある。このとき`${}`で囲む

例:

```typescript=
'2 + 4' -> '2 + 4'
'${2 + 4}' -> '${2 + 4}'
"2 + 4" -> '2 + 4'
"${2 + 4}" -> '${2 + 4}'
`2 + 4` -> '2 + 4'
`${2 + 4}` -> '6'
```

`boolean`型ははい(true)、いいえ(false)

`boolean`型は`if`の構文の判定に使える唯一の型。
（厳密に言えば他の型も使えるが、基本的に意図しない結果になりがちなのでお勧めしない）

### 四則演算をする

`number`型同士の四則演算

- `+` ... 足し算
- `-` ... 引き算
- `*` ... 掛け算
- `/` ... 割り算
- `%` ... 割り算のあまり

`string`型は足し算だけできる

`'a' + 'b' = 'ab'`

### 型の変換をする

#### `number`型から`string`型に変換する

```typescript
`${num}`;
```

#### `string`型から`number`型に変換する

```typescript
Number(str);
```

`str`が`''`空文字のときは`Number(str) = 0`
`str`が数字でないときは`Number(str) = NaN`

ある変数定数が`NaN`かどうかを判定するためには
`Number.isNaN()`を使う

```typescript=
if (Number.isNaN(num)) {
    // 数値がNaNだったときの処理
}
```

### `if`

`if`のあとのカッコの中身の内容が正しければそのあとの`{}`を実行、そうでなければ実行しない

```typescript=
if (num === 0) {
    // numが0だったらここが実行される
}
```

`if`のあとの`{}`のあとに`else`をつけると`if`のカッコの中身の内容が正しくない場合に`else`のあとの`{}`が実行される。

```typescript=
if (num === 0) {
    // numが0だったらここが実行される
} else {
    // numが0以外だったらここが実行される
}
```

`if`の条件を複数かくこともできる

#### `&&` ... (AND)

#### `||` ... OR


#### `===`

上述の通りだが、左右のオペランドが等しいときに`true`、そうでないときに`false`を返す演算子

#### `!==`

`===`とは異なり、左右のオペランドが等しくないときに`true`、そうでないときに`false`を返す演算子

#### `!`

`!==`と似ているがあるifの条件を反転させたいときにつかう。たとえば今回使うであろう`string.includes(str)`を反転させたいときは`!string.includes(str)`とする

:point_down: これは`count`が`.`を含むなら。の意味

```typescript=
if (count.includes('.')) {
    // 含んでいるときにすること
}
```

:point_down: これはその逆転。`count`が`.`を含まないなら。の意味

```typescript=
if (!count.includes('.')) {
    // 含んでいないときにすること
}
```

### `number`型の`NaN`

`NaN`はNot a Numberのことであり、数値でないと名乗っておきながら`number`型。変な特徴をもつ

- `NaN + 1 = NaN` (どんな数値でも)
- `0 / 0 = NaN`
- `NaN === NaN // false` (同値比較して`false`になる唯一の値)

### 関数

同じ処理を何度も書きたくないときに関数を書くことでまとめることができる。書きかたはみっつある。（以下は足し算をする関数`add`を定義した例）

```typescript=
function add(num1: number, num2: number): number {
    return num1 + num2;
}

const add = function(num1: number, num2: number): number {
    return num1 + num2;
}

const add = (num1: number, num2: number): number => {
    return num1 + num2;
}
```

`return`は関数の戻り値を指定する。`return`があるとそこで処理は終了する。

React.jsでは一番下の方式を採用しているので、合わせたほうが無難。なお、違う方式を採用したからと何かがガラっと変わるわけではない。

### `switch`

`if`と同じように条件分岐に使えるが、少し癖が強い。
基本的な構文は以下の通り。

```typescript=
switch(num) {
    case value1:
        // num === value1のとき実行される
    case value2:
        // num === value2のとき実行される
    default:
        // それ以外のとき実行される
}
```

- `case`はいくらでも増やすことができる
- `default`は省略できる

これだけ見るとある月が与えられたとき、その月の日数を返す処理として以下を考えると、ちょっとswitchの使いにくいところがわかる。

```typescript=
switch(month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
        num = 31;
    case 2:
        num = 28;
    case 4:
    case 6:
    case 9:
    case 11:
        num = 30
}
```

`case`の条件を満たしたとき、その下にある式を**すべて実施する**という特徴がある。この`switch`は与えられた`month`を元にその月の日数を`num`に代入しているように見えるが、実はそうではない。`switch`には`fallthrough`という罠があるためである。

`fallthrough`とは条件に合致したあとそれより下の式**すべて実施する**ということであり、たとえば`month = 1`のときであれば`case 1`に合致するがそのあと`case 3, case 5`と合致し`case 12`まで合致、`num = 31`となるが処理は止まらず`case 2`で`num`は上書きされ、さらに`case 11`でまた`num`は上書きされ結局`num`は`30`になる。これはどの`month`を代入してもそうなってしまう。

これを避けるためには`break`を使う。`break`はその処理を強制的に抜けるという意味があり、これを差し込むことによって意図する日数をえられる。最終的な`switch`は

```typescript=
switch(month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
        num = 31;
        break;
    case 2:
        num = 28;
        break;
    case 4:
    case 6:
    case 9:
    case 11:
        num = 30
}
```

(最後はどうせ処理を抜けるので`break`は必要ない)

### ある文字が含まれることを判定する

ある`string`型の文字列が`str`を含んでいるかを判定するには`string.includes(str)`とする。
今回は小数点を複数回入力させない目的で使用する。

```typescript=
if (count.includes('.')) {
    // '.' を含んでいればすること
}
```

### 実装する上で考えること

#### 数値を入力したとき

`123`と数値が入力されていて`4`を入力したら`1234`としたい。
これを電卓で再現するためには以下のふたつがすぐに思いつく

1. 元の数値を10倍して入力した数値を足す
2. 元の数値と入力した数値を文字にして足して、数値に戻す

とくにこだわりがなければ2.のほうが楽なのでそちらで実装したほうがよい。なぜなら小数点を考慮すると1.だと別の処理が必要になる。

例: `1.2`が入力されていて`3`を入力したら
想定する結果: `1.23`が表示される

1.のやりかただと`1.2 * 10 + 3 = 15`とまったく意図しない値になる。
一方2.だと`'1.2' + '3' = '1.23'`で（数値ではないが）表示は正しい。あとはこれを`number`型に直してやればよい。


#### 値を記憶する場所を増やす

`useState<TYPE>(INITIAL_VALUE)`で値を保存できる場所を増やすことができる。よほど大きなデータでない限りいくらでも増やせる。

`TYPE`は型。ここでは主に`string`, `number`, `boolean`型のどれか。
`INITIAL_VALUE`は初期値、型に沿った値を選ぶ必要がある。

```typescript=
const [val, setVal] = useState<number>(100); // 初期値100のnumber型の変数valと値更新用の関数setValを定義
const [str, setStr] = useState<string>('potato') // 初期値'potato'のstring型の変数strと値更新用の関数setStrを定義
```

#### 値の更新

通常のTSであれば`let`で宣言した変数に対し

```typescript=
let i = 0;

i = 1
```

のように更新ができるが、React.jsではそうはいかず`useState`を使って生み出した変数は一緒に生み出されたセッターを使う。

```typescript=
const [xxx, setXxx] = useState<number>(0);

setXxx(1);
```

このとき`useState<number>(0)`の`number`はその変数`xxx`が持てる型を、`(0)`は`xxx`の初期値を意味している。