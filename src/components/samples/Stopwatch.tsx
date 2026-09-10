// サンプル: トップページ(/)で表示中。直接編集せず、書き方を真似て自分のページに書いてください
'use client';

import { type ReactElement, useEffect, useState } from 'react';

export const Stopwatch = (): ReactElement => {
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSeconds(seconds + 1);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [seconds]);

  return (
    <div className="m-10 p-4 w-2/3 mx-auto shadow-lg border-2 rounded-2xl">
      <div className="p-3 border-2 rounded text-center">
        <span className="text-gray-700 select-none text-3xl font-mono">{seconds}秒経過</span>
      </div>
    </div>
  );
};
