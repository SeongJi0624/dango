// サンプル: トップページ(/)で表示中。直接編集せず、書き方を真似て自分のページに書いてください
'use client';

import { type ReactElement, useState } from 'react';
import { Button } from '../Button';

const DIGITS = ['7', '8', '9', '4', '5', '6', '1', '2', '3'];

export const Counter = (): ReactElement => {
  const [display, setDisplay] = useState<string>('0');

  const onDigit = (digit: string): void => {
    if (display === '0') {
      setDisplay(digit);

      return;
    }

    setDisplay(display + digit);
  };

  return (
    <div className="m-10 p-4 w-2/3 mx-auto shadow-lg border-2 rounded-2xl">
      <div className="mx-auto">
        <div className="p-3 mb-3 border-2 rounded h-full w-full text-right">
          <span className="text-gray-700 select-none">{display}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {DIGITS.map((digit: string) => {
            return (
              <Button
                key={digit}
                className="py-2 bg-cyan-600 text-white rounded border border-gray-200 cursor-pointer"
                onClick={() => {
                  onDigit(digit);
                }}
              >
                <span className="select-none text-xl">{digit}</span>
              </Button>
            );
          })}
          <Button
            className="py-2 bg-cyan-600 text-white rounded border border-gray-200 cursor-pointer col-span-2"
            onClick={() => {
              onDigit('0');
            }}
          >
            <span className="select-none text-xl">0</span>
          </Button>
          <Button
            className="py-2 bg-red-600 text-white rounded border border-gray-200 cursor-pointer"
            onClick={() => {
              setDisplay('0');
            }}
          >
            <span className="select-none text-xl">C</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
