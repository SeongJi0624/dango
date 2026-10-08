'use client';

import React, { type ReactElement, useEffect, useState } from 'react';
import { Button } from '../../components/Button';

// 現在選択されている演算子。何も選択されていない場合は null
type Operator = '+' | '-' | '*' | '/' | null;
// 履歴1件分のデータ。key に使うための id を持たせる
type HistoryEntry = {
  id: number;
  text: string;
};

// 数字ボタンのスタイル(濃いグレー)
const digitButtonClassName =
  'py-2 bg-gray-700 text-white rounded border border-gray-600 cursor-pointer';

// 数字以外のボタン(演算子・C・=)のスタイル。数字ボタンより一段濃くして視覚的に区別する
const functionButtonClassName =
  'py-2 bg-gray-900 text-white rounded border border-gray-600 cursor-pointer';

// 浮動小数点の誤差を取り除くためのヘルパー関数
// (例: 0.1 + 0.2 が 0.30000000000000004 になってしまう問題を防ぐ)
// 小数点以下10桁で丸めた後、parseFloat で不要な末尾の0を取り除く
const roundResult = (value: number): number => {
  return parseFloat(value.toFixed(10));
};

// 演算子に応じて2つの値を計算するヘルパー関数
// applyOperator と calculateResult で共通して使う
// 0で割ろうとした場合は NaN を返し、呼び出し側で "Error" 表示に変換する
const calculate = (a: number, b: number, op: Operator): number => {
  switch (op) {
    case '+':
      return roundResult(a + b);
    case '-':
      return roundResult(a - b);
    case '*':
      return roundResult(a * b);
    case '/':
      return b === 0 ? NaN : roundResult(a / b);
    // 0で割ったときの処理を一時的に消して、5 / 0 =と0 / 0 =を計算してみよう。それぞれ何が表示されるか確かめよう（NaNの特徴を見返してみよう）
    // return roundResult(a / b);
    default:
      return b;
  }
};

// 履歴に表示するための演算子の記号
const operatorSymbols: Record<Exclude<Operator, null>, string> = {
  '+': '+',
  '-': '-',
  '*': '×',
  '/': '÷',
};

const CalculatorPage = (): ReactElement => {
  // 画面に表示中の値(文字列で保持し、入力途中の小数点なども扱えるようにする)
  const [display, setDisplay] = useState<string>('0');
  // 演算子が押される前に確定していた値
  const [storedValue, setStoredValue] = useState<number | null>(null);
  // 現在選択中の演算子(+, -, *, / のいずれか)
  const [operator, setOperator] = useState<Operator>(null);
  // true の間は次の数字入力で表示をリセットして新しく打ち始める
  // (演算子や = を押した直後は、実物の電卓と同様にそれまでの値を表示し続ける)
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  // 計算履歴(例: "1 + 2 = 3")。新しいものが先頭に来る
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  // = を押すまでに入力した式(例: "1 + 2 + ")。履歴表示用
  const [expression, setExpression] = useState<string>('');

  // 数字ボタン押下時の処理
  // waitingForOperand が true の場合(演算子や = の直後)は表示を新しい数字で置き換え、
  // それ以外は表示が"0"のときのみ置き換え、それ以外は末尾に追加する
  const inputDigit = (digit: string): void => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
      return;
    }
    setDisplay((prev: string) => (prev === '0' ? digit : prev + digit));
  };

  // 小数点ボタン押下時の処理。既に小数点がある場合は無視する
  const inputDecimalPoint = (): void => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    setDisplay((prev: string) => (prev.includes('.') ? prev : prev + '.'));
    //小数点を2個以上入力できないようにしているifを一時的に消して、
    //1..2のように入力してから=を押してみよう。何が表示されるか確かめ、Number('1..2')の結果と見比べてみよう
    // setDisplay(Number('1..2'));
  };

  // Cボタン押下時の処理。表示・保持値・演算子をすべて初期状態に戻す
  const clear = (): void => {
    setDisplay('0');
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setExpression('');
  };

  // Backspaceボタン押下時の処理。表示の末尾1文字を削除する
  const deleteLastDigit = (): void => {
    if (display === 'Error') {
      clear();
      return;
    }
    // 演算子や = を押した直後は、入力中でないので Backspace は無視する
    if (waitingForOperand) {
      return;
    }
    setDisplay((prev: string) => {
      const next = prev.slice(0, -1);
      return next === '' ? '0' : next;
    });
  };

  // +/- ボタン押下時の処理
  // すでに演算子が選択されていた場合は、先に前回の計算を確定させてから
  // 新しい演算子を保持する
  const applyOperator = (nextOperator: Exclude<Operator, null>): void => {
    const currentValue = Number(display);

    if (storedValue === null) {
      setStoredValue(currentValue);
    } else if (operator && !waitingForOperand) {
      const result = calculate(storedValue, currentValue, operator);

      if (Number.isNaN(result)) {
        setDisplay('Error');
        setStoredValue(null);
        setOperator(null);
        setWaitingForOperand(true);
        setExpression(''); // 式もリセット
        return;
      }

      setStoredValue(result);
      setDisplay(String(result));
    }

    const symbol = operatorSymbols[nextOperator];
    if (operator !== null && waitingForOperand) {
      // 数字を打たずに演算子だけ押し直した場合(例: 1 + → -)は、末尾の記号を差し替える
      setExpression((prev: string) => `${prev.slice(0, -2)}${symbol} `);
    } else {
      // 今の値と演算子を式の末尾に追加する
      setExpression((prev: string) => `${prev}${currentValue} ${symbol} `);
    }

    setOperator(nextOperator);
    setWaitingForOperand(true);
  };

  // =ボタン押下時の処理。保持値と現在値を演算子に従って計算し、表示・状態をリセットする
  const calculateResult = (): void => {
    if (storedValue === null || operator === null) {
      return;
    }

    const currentValue = Number(display);
    const result = calculate(storedValue, currentValue, operator);
    const resultText = Number.isNaN(result) ? 'Error' : String(result);

    // // 式と結果を履歴の先頭に追加する
    // const entry = `${storedValue} ${operatorSymbols[operator]} ${currentValue} = ${resultText}`;
    // setHistory((prev: string[]) => [entry, ...prev]);
    const text = `${expression}${currentValue} = ${resultText}`;
    setHistory((prev: HistoryEntry[]) => [{ id: prev.length, text }, ...prev]);
    setExpression(''); // 次の計算のために空にする

    setDisplay(resultText);
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  // キーボード入力に対応するための useEffect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      const { key } = e;

      if (/^[0-9]$/.test(key)) {
        inputDigit(key);
      } else if (key === '.') {
        inputDecimalPoint();
      } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        e.preventDefault(); // Firefoxで演算子がフォーム送信されるのを防ぐ
        applyOperator(key);
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault(); // FirefoxでEnterがフォーム送信されるのを防ぐ
        calculateResult();
      } else if (key === 'Backspace') {
        deleteLastDigit();
      } else if (key === 'Escape') {
        clear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // クリーンアップ関数を返して、コンポーネントがアンマウントされるときにイベントリスナーを削除する
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="m-10 p-4 w-2/3 mx-auto shadow-lg border-2 rounded-2xl">
      <div className="mx-auto">
        {/* 計算結果・入力中の値を表示するディスプレイ部分 */}
        <div className="p-3 mb-3 border-2 rounded h-full w-full text-right">
          <span className="text-gray-700 select-none text-4xl font-semibold">{display}</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* 1行目: 7, 8, 9, ÷ */}
          <Button className={digitButtonClassName} onClick={() => inputDigit('7')}>
            <span className="select-none text-xl">7</span>
          </Button>
          <Button className={digitButtonClassName} onClick={() => inputDigit('8')}>
            <span className="select-none text-xl">8</span>
          </Button>
          <Button className={digitButtonClassName} onClick={() => inputDigit('9')}>
            <span className="select-none text-xl">9</span>
          </Button>
          <Button className={functionButtonClassName} onClick={() => applyOperator('/')}>
            <span className="select-none text-xl">÷</span>
          </Button>

          {/* 2行目: 4, 5, 6, × */}
          <Button className={digitButtonClassName} onClick={() => inputDigit('4')}>
            <span className="select-none text-xl">4</span>
          </Button>
          <Button className={digitButtonClassName} onClick={() => inputDigit('5')}>
            <span className="select-none text-xl">5</span>
          </Button>
          <Button className={digitButtonClassName} onClick={() => inputDigit('6')}>
            <span className="select-none text-xl">6</span>
          </Button>
          <Button className={functionButtonClassName} onClick={() => applyOperator('*')}>
            <span className="select-none text-xl">×</span>
          </Button>

          {/* 3行目: 1, 2, 3, - */}
          <Button className={digitButtonClassName} onClick={() => inputDigit('1')}>
            <span className="select-none text-xl">1</span>
          </Button>
          <Button className={digitButtonClassName} onClick={() => inputDigit('2')}>
            <span className="select-none text-xl">2</span>
          </Button>
          <Button className={digitButtonClassName} onClick={() => inputDigit('3')}>
            <span className="select-none text-xl">3</span>
          </Button>
          <Button className={functionButtonClassName} onClick={() => applyOperator('-')}>
            <span className="select-none text-xl">-</span>
          </Button>

          {/* 4行目: 0, ., C, + */}
          <Button className={digitButtonClassName} onClick={() => inputDigit('0')}>
            <span className="select-none text-xl">0</span>
          </Button>
          <Button className={digitButtonClassName} onClick={inputDecimalPoint}>
            <span className="select-none text-xl">.</span>
          </Button>
          <Button className={functionButtonClassName} onClick={clear}>
            <span className="select-none text-xl">C</span>
          </Button>
          <Button className={functionButtonClassName} onClick={() => applyOperator('+')}>
            <span className="select-none text-xl">+</span>
          </Button>

          {/* 5行目: = (全幅) */}
          <Button className={`${functionButtonClassName} col-span-4`} onClick={calculateResult}>
            <span className="select-none text-xl">=</span>
          </Button>
        </div>

        {/* 計算履歴 */}
        {history.length > 0 && (
          <div className="mt-4 border-t pt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500 text-sm">履歴</span>
              <button
                type="button"
                className="text-sm text-gray-500 underline cursor-pointer"
                onClick={() => setHistory([])}
              >
                履歴を消す
              </button>
            </div>
            <ul className="max-h-40 overflow-y-auto text-right">
              {history.map((entry: HistoryEntry) => (
                <li key={entry.id} className="text-gray-700 py-1">
                  {entry.text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// eslint-disable-next-line import/no-default-export
export default CalculatorPage;
