'use client';

import { type ChangeEvent, type ReactElement, useState } from 'react';

let table_cnt: number;
// const [isValid, setIsValid] = useState(false);
let isValid: boolean;

function updateTable(inputTable: string) {
  const num = Number(inputTable);
  console.log(num);

  if (Number.isNaN(num)) {
    return false;
  } else {
    table_cnt = num;
    return true;
  }
}

const ArrangementPage = (): ReactElement => {
  // 参加者情報フォーマット
  type Participant = {
    id: number;
    name: string;
  };

  const [participants, setParticipants] = useState<Participant[]>([{ name: '', id: Date.now() }]);

  // 参加者の行追加
  function addParticipant() {
    setParticipants((prev) => [...prev, { name: '', id: Date.now() }]);
  }

  // 参加者の行削除
  function deleteParticipant(id: number) {
    setParticipants(participants.filter((b) => b.id !== id));
  }

  function onDecide() {}

  return (
    <div className="m-10 p-4 w-2/3 mx-auto shadow-lg border-2 rounded-2xl text-lg">
      {/* 1行目 */}
      <div className="grid h-12 items-center gap-4">
        <span>テーブルの数</span>
      </div>

      {/* 2行目 テーブルの数を入力*/}
      <div className="grid h-12 items-center gap-4">
        <input
          type="text"
          className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs"
          value={table_cnt}
          // onChange={updateTable}
        />
      </div>

      {/* 3行目 文字を入力した時に表示*/}
      <div className="grid h-12 items-center gap-4">
        <span>正の整数を入力してください</span>
      </div>

      {/* 4行目 参加者を入力*/}
      <div className="grid h-12 grid-cols-2 items-center gap-4">
        <span>参加者</span>
        <button
          type="button"
          onClick={addParticipant}
          className="bg-cyan-600 hover:bg-cyan-800 text-white font-medium py-1 px-4 rounded-full"
        >
          + 参加者を追加
        </button>
      </div>

      {/* 5行目 参加者の名前を入力*/}
      {participants.map((b) => (
        <div key={b.id} className="grid h-12 grid-cols-5 items-center gap-4">
          <input
            type="text"
            value={b.name}
            className="block px-3 py-2.5 col-span-4 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base shadow-xs"
          />

          <button
            type="button"
            name="delete_row"
            onClick={() => deleteParticipant(b.id)}
            className="bg-rose-400 hover:bg-rose-500 text-white font-medium py-1 px-4 rounded-full"
          >
            削除
          </button>
        </div>
      ))}

      {/* 6行目 座席を決める*/}
      <div className="grid h-12 items-center gap-4">
        <button
          type="button"
          // disabled={!isValid}
          onClick={onDecide}
          className="bg-stone-400 hover:bg-stone-500 text-white font-medium py-1 px-4 rounded-full"
        >
          座席を決める
        </button>
      </div>
    </div>
  );
};

export default ArrangementPage;
