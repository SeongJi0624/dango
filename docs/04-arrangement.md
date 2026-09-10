# #4 座席を決めよう

参加者の人数とテーブルの数を入力すると参加者の座席をランダムに決めるアプリケーションを作ってみよう。

## サンプル

<https://github.com/jamashita/dango>

## 完成例

<https://vctms.jamashita.dev/arrangement>

## ページ

`src/app/arrangement/page.tsx`をあらかじめ用意してあります。`pnpm dev`した状態で<http://localhost:3000/arrangement>にアクセスすると「座席決めをここに作ろう」とだけ表示されるはずです。このファイルの中身を書き換えて実装していきます。ページ自体の作りかたを忘れた場合は`docs/02-calculator.md`を見返してください。

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

1. テーブルの数を数字で入力できること
    - 数字以外が入力されている間はエラーメッセージを出すか、そもそも数字を入力できないようにすること
    - (補足) `<input type="text" ...>`のバリデーションだけで対応してもよいですし、`<input type="number" ...>`にすると数字以外を入力しづらいフォームになります。どちらでも構いません
2. 参加者の名前を入力できるようにすること
    - 参加者は人数を増減できるようにすること
3. テーブルの数が正の整数で、かつ参加者の名前がすべて入力されているときに座席を決めるボタンを押せるようになること
    - 座席を決めるボタンを押すとランダムで座席が決まること
4. (できれば) テーブルをできるだけ分ける機能
    - AさんとBさんはできるだけ別テーブルにする。みたいな機能のこと

## 注意するところ

- 参加者の人数を増減する部分は、「#3 勤務時間を管理しよう」の休憩時間で出てきた「配列のstateを増やしたり減らしたりする」考え方と同じです。下の「学習の意図」に具体的な書き方があります
- 「ランダムに決める」「テーブルに振り分ける」部分はこれまでの課題に出てきていない新しい内容です。焦らず「学習の意図」を先に読んでから取り組んでください
- 4番の「(できれば)」は難易度が高いので、まずは3番まで（ランダムに1回で決める）を完成させることを目指してください

## 学習の意図

### 配列の要素を増やす・減らす

参加者の名前のように「入力欄の数自体が変わる」ものは、名前の配列をstateで持ち、ボタンで配列の中身を増減させます。

```typescript=
const [participants, setParticipants] = useState<Array<string>>(['']);

const addParticipant = (): void => {
  setParticipants([...participants, '']);
};

const removeParticipant = (index: number): void => {
  setParticipants(participants.filter((_name, i) => i !== index));
};
```

- `addParticipant`は今までの配列の中身に空文字`''`を1つ増やした、新しい配列を作ってstateにセットしています（配列そのものを直接書き換えてはいけません）
- `removeParticipant`は`filter`を使い、「消したい`index`と違う場所にあるものだけ」を残した新しい配列を作っています

### ランダムに並び替える（シャッフル）

`Math.random()`は`0`以上`1`未満のランダムな数値を返します。これを使うと配列をランダムな順番に並び替える（シャッフルする）ことができます。

```typescript=
const shuffle = (items: Array<string>): Array<string> => {
  return [...items].sort(() => Math.random() - 0.5);
};
```

`sort()`は本来「並び替えの基準」を書く関数ですが、ランダムな値を返すようにすることでシャッフルとして使えます。`[...items]`としているのは、元の配列を壊さず新しい配列を作るためです。

### テーブルに振り分ける

シャッフルした参加者を、テーブルの数だけ順番に振り分けていきます。何番目の参加者が何番目のテーブルに入るかは「あまりの計算（`%`）」で決められます。

```typescript=
const tableCount = 3; // 実際にはテーブルの数の入力値を使う
const shuffled = shuffle(participants);

const tables: Array<Array<string>> = [];

for (let i = 0; i < tableCount; i++) {
  tables.push([]);
}

shuffled.forEach((name, i) => {
  const table = tables[i % tableCount];

  if (table !== undefined) {
    table.push(name);
  }
});
```

`tableCount`が3のとき、`i % tableCount`は`0, 1, 2, 0, 1, 2, ...`と繰り返されるので、参加者が順番に0番目・1番目・2番目のテーブルへ均等に振り分けられます。

### 正の整数かどうかを判定する

テーブルの数の入力チェックには`Number.isInteger()`が使えます。考え方は「#3 勤務時間を管理しよう」で書いた`isValidTime`と同じです。

```typescript=
const isPositiveInteger = (value: string): boolean => {
  const num = Number(value);

  return Number.isInteger(num) && num > 0;
};
```

### ボタンを押せる/押せないを切り替える

`Button`コンポーネントは`disabled`というpropsを持っているので、条件を満たしていないときは`true`を渡せば押せなくなります。

```typescript=
<Button
  disabled={!isValid}
  className="py-2 bg-cyan-600 text-white rounded"
  onClick={onDecide}
>
  座席を決める
</Button>
```

`isValid`は「テーブルの数が正の整数か（`isPositiveInteger`）」と「参加者の名前が全部入力されているか」をまとめた`boolean`型の変数を自分で用意してください。

「配列の中身が全部条件を満たしているか」は`every()`を使うと判定できます。渡した関数が全要素で`true`を返したときだけ、全体としても`true`になります。

```typescript=
const names = ['たろう', 'はなこ', 'じろう'];

console.log(names.every((name) => name !== '')); // true（全部空文字じゃない）

const withEmpty = ['たろう', '', 'じろう'];

console.log(withEmpty.every((name) => name !== '')); // false（ひとつ空文字がある）
```

```typescript=
const isValid = isPositiveInteger(tableCountInput) && participants.every((name) => name !== '');
```
