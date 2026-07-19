import { promises } from 'fs';
import { GetStaticProps, NextPage } from 'next';
import { join } from 'path';
import React, { ReactElement, useEffect, useState } from 'react';
import { Button } from '../components/Button';

type Props = Readonly<{
  countries: Array<Country>;
}>;

// 現在選択されている演算子。何も選択されていない場合は null
type Operator = '+' | '-' | null;

// 数字ボタン(7〜9, 4〜6, 1〜3)を配列化し、JSXの重複を避ける
const DIGIT_BUTTONS: ReadonlyArray<string> = [
  '7', '8', '9',
  '4', '5', '6',
  '1', '2', '3',
];

// 全ボタン共通のスタイル
const buttonClassName =
  'py-2 bg-gray-800 text-white rounded border border-gray-200 cursor-pointer';

const IndexPage: NextPage<Props> = ({ countries }: Props): ReactElement => {
  // 画面に表示中の値(文字列で保持し、入力途中の小数点なども扱えるようにする)
  const [display, setDisplay] = useState<string>('0');
  // 演算子が押される前に確定していた値
  const [storedValue, setStoredValue] = useState<number | null>(null);
  // 現在選択中の演算子(+ か -)
  const [operator, setOperator] = useState<Operator>(null);
  // true の間は次の数字入力で表示をリセットして新しく打ち始める
  // (演算子や = を押した直後は、実物の電卓と同様にそれまでの値を表示し続ける)
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);


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
  };

  // Cボタン押下時の処理。表示・保持値・演算子をすべて初期状態に戻す
  const clear = (): void => {
    setDisplay('0');
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  // +/- ボタン押下時の処理
  // すでに演算子が選択されていた場合は、先に前回の計算を確定させてから
  // 新しい演算子を保持する
  const applyOperator = (nextOperator: Operator): void => {
    const currentValue = Number(display);

    if (storedValue === null) {
      // 初回の演算子入力: 現在の表示値をそのまま保持する
      setStoredValue(currentValue);
    } else if (operator && !waitingForOperand) {
      // 2回目以降(まだ数字を打ち直していない場合): 前の演算子で計算してから保持値を更新する
      const result = operator === '+' ? storedValue + currentValue : storedValue - currentValue;

      setStoredValue(result);
      setDisplay(String(result));
    }

    // 表示はリセットせず、そのまま前の値を見せておく
    // (次に数字ボタンが押された時点で新しく打ち始める)
    setOperator(nextOperator);
    setWaitingForOperand(true);
  };

  // =ボタン押下時の処理。保持値と現在値を演算子に従って計算し、表示・状態をリセットする
  const calculateResult = (): void => {
    if (storedValue === null || operator === null) {
      return;
    }

    const currentValue = Number(display);
    const result = operator === '+' ? storedValue + currentValue : storedValue - currentValue;

    setDisplay(String(result));
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  return (
    <div className="m-10 p-4 w-2/3 mx-auto shadow-lg border-2 rounded-2xl">

      <div className="mx-auto">
        {/* 計算結果・入力中の値を表示するディスプレイ部分 */}
        <div className="p-3 mb-3 border-2 rounded h-full w-full text-right">
          <span className="text-gray-700 select-none">{display}</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* 7〜9, 4〜6, 1〜3 の数字ボタンをまとめて描画 */}
          {DIGIT_BUTTONS.map((digit: string) => (
            <Button key={digit} className={buttonClassName} onClick={() => inputDigit(digit)}>
              <span className="select-none text-xl">{digit}</span>
            </Button>
          ))}

          <Button className={buttonClassName} onClick={() => inputDigit('0')}>
            <span className="select-none text-xl">0</span>
          </Button>
          <Button className={buttonClassName} onClick={inputDecimalPoint}>
            <span className="select-none text-xl">.</span>
          </Button>
          <Button className={buttonClassName} onClick={clear}>
            <span className="select-none text-xl">C</span>
          </Button>

          <Button className={buttonClassName} onClick={() => applyOperator('+')}>
            <span className="select-none text-xl">+</span>
          </Button>
          <Button className={buttonClassName} onClick={() => applyOperator('-')}>
            <span className="select-none text-xl">-</span>
          </Button>
          <Button className={buttonClassName} onClick={calculateResult}>
            <span className="select-none text-xl">=</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

// ビルド時に国データ(JSON)を読み込み、propsとしてページに渡す
export const getStaticProps: GetStaticProps<Props> = async () => {
  const buffer = await promises.readFile(join(process.cwd(), 'json', 'countries.json'));
  const str = buffer.toString();

  return {
    props: {
      countries: JSON.parse(str) as Array<Country>,
    },
  };
};

// eslint-disable-next-line import/no-default-export
export default IndexPage;