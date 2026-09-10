// サンプル: トップページ(/)で表示中。直接編集せず、書き方を真似て自分のページに書いてください
'use client';

import { type ReactElement, useState } from 'react';
import { Button } from '../Button';

export const SimpleCounter = (): ReactElement => {
  const [count, setCount] = useState<number>(0);

  const increment = (): void => {
    setCount(count + 1);
  };

  const decrement = (): void => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  const reset = (): void => {
    setCount(0);
  };

  return (
    <div className="m-10 p-4 w-2/3 mx-auto shadow-lg border-2 rounded-2xl">
      <div className="mx-auto">
        <div className="p-3 mb-3 border-2 rounded h-full w-full text-right">
          <span className="text-gray-700 select-none">{count}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button
            className="py-2 bg-cyan-600 text-white rounded border border-gray-200 cursor-pointer"
            onClick={increment}
          >
            <span className="select-none text-xl">+1</span>
          </Button>
          <Button
            className="py-2 bg-cyan-600 text-white rounded border border-gray-200 cursor-pointer"
            onClick={decrement}
          >
            <span className="select-none text-xl">-1</span>
          </Button>
          <Button
            className="py-2 bg-cyan-600 text-white rounded border border-gray-200 cursor-pointer"
            onClick={reset}
          >
            <span className="select-none text-xl">リセット</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
