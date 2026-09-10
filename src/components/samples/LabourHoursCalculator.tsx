// サンプル: トップページ(/)で表示中。直接編集せず、書き方を真似て自分のページに書いてください
'use client';

import { type ChangeEvent, type ReactElement, useState } from 'react';

export const LabourHoursCalculator = (): ReactElement => {
  const [labourHours, setLabourHours] = useState<string>('0');

  return (
    <div className="m-10 p-4 w-2/3 mx-auto shadow-lg border-2 rounded-2xl">
      <div className="mx-auto">
        <div className="grid grid-cols-3 gap-2">
          <span className="text-gray-800 text-lg">勤務開始時間</span>
          <span className="text-gray-800 text-lg">勤務終了時間</span>
          <span className="text-gray-800 text-lg">労働時間</span>
          <input
            className="py-2 px-3 border-2 rounded border-gray-200 cursor-text"
            type="text"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              console.log(e.target.value);

              setLabourHours(e.target.value);
            }}
          />
          <input
            className="py-2 px-3 border-2 rounded border-gray-200 cursor-text"
            type="text"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              console.log(e.target.value);

              setLabourHours(e.target.value);
            }}
          />
          <span className="select-none text-xl font-mono text-gray-700 text-right">
            {labourHours}
          </span>
        </div>
      </div>
    </div>
  );
};
