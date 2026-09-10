// サンプル: トップページ(/)で表示中。直接編集せず、書き方を真似て自分のページに書いてください
'use client';

import type { ChangeEvent, ReactElement } from 'react';

export const FormShowcase = (): ReactElement => {
  return (
    <div className="m-10 p-4 w-2/3 mx-auto shadow-lg border-2 rounded-2xl">
      フォームで使いそうなもの
      <ul className="list-none">
        <li className="text-gray-800 even:bg-teal-100 text-lg">
          <input
            className="py-2 px-3 border-2 rounded border-gray-200 cursor-text"
            type="text"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              console.log(e.target.value);
            }}
            placeholder="テキストボックスです"
          />
        </li>
        <li>
          <select
            className="cursor-pointer border rounded py-3 px-4"
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              console.log(e.target.value);
            }}
            value={0}
          >
            <option value={0}>選択してください</option>
            <option value={1}>選択肢1</option>
            <option value={2}>選択肢2</option>
            <option value={3}>選択肢3</option>
          </select>
        </li>
      </ul>
    </div>
  );
};
