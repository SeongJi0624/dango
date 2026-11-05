'use client';

import { type ChangeEvent, type ReactElement, useState } from 'react';

const cellStyle = 'text-lg font-medium text-gray-500';
const inputStyle =
  'h-full w-full rounded-lg border border-gray-300 px-3 focus:border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-100';
// const cellTimeStyle = { width: '150px', height: '70', border: 'solid 1px'} as const;

let working_hour = '';
type Break = { id: number; start: string; end: string };

// 時間を分に変換
const toMinutes = (time: string): number => {
  const [h = 0, m = 0] = time.split(':').map(Number);
  return h * 60 + m;
};

// 分を時間に変換
const toHourMinutes = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}時間${m}分`;
};

// 休憩時間が重複する場合、重複を除外する。
const duplicateBreakHour = (breakList: Break[]): number => {
  // 入力データを時間順に並び変え
  const ranges = breakList
    .filter((b) => b.start && b.end)
    .map((b) => ({ start: toMinutes(b.start), end: toMinutes(b.end) }))
    .filter((r) => r.end > r.start)
    .sort((a, b) => a.start - b.start);

  let total = 0;
  let currentStart = -1;
  let currentEnd = -1;

  for (const r of ranges) {
    if (r.start <= currentEnd) {
      //時間が重複する場合は終了時間を延ばす
      currentEnd = Math.max(currentEnd, r.end);
    } else {
      //重複なしは休憩時間を合計する
      if (currentEnd > currentStart) total += currentEnd - currentStart;
      currentStart = r.start;
      currentEnd = r.end;
    }
  }
  if (currentEnd > currentStart) total += currentEnd - currentStart;

  return total;
};

// 勤務時間を計算
const calculateWorkingHour = (workStart: string, workEnd: string, breaks: Break[]): string => {
  if (workStart != null && workEnd != null) {
    // 終了時間 - 開始時間
    const working_minutes = toMinutes(workEnd) - toMinutes(workStart);
    const breakMinutes = duplicateBreakHour(breaks); //重複時間を確認
    working_hour = toHourMinutes(working_minutes - breakMinutes);
    console.log('勤務時間:', working_hour);
  }
  return working_hour;
};

const LabourPage = (): ReactElement => {
  // 業務開始時間（デフォルト）
  const [workStart, setWorkStart] = useState('09:00');

  // 業務終了時間（デフォルト）
  const [workEnd, setWorkEnd] = useState('18:00');

  // 休憩時間配列
  const [breaks, setBreaks] = useState<Break[]>([]);
  // 休憩時間の行追加
  const addBreak = () => {
    setBreaks([...breaks, { id: Date.now(), start: '12:00', end: '13:00' }]);
  };

  // 休憩時間の行削除
  const deleteBreak = (id: number) => {
    setBreaks(breaks.filter((b) => b.id !== id));
  };

  // 休憩時間（入力）
  const updateBreak = (id: number, key: 'start' | 'end', value: string) => {
    setBreaks(breaks.map((b) => (b.id === id ? { ...b, [key]: value } : b)));
    calculateWorkingHour(workStart, workEnd, breaks);
  };

  // 業務開始時間（入力）
  const handleWorkStartChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWorkStart(e.target.value);
    console.log('勤務開始時間:', workStart);
  };

  // 業務終了時間（入力）
  const handleWorkEndChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWorkEnd(e.target.value);
    console.log('勤務終了時間:', workEnd);
  };

  // 実際の業務時間を計算
  const working_hour = calculateWorkingHour(workStart, workEnd, breaks);

  return (
    <div className="m-10 p-4 w-2/3 mx-auto shadow-lg border-2 rounded-2xl text-lg">
      {/* 1行目 */}
      <div className="grid h-12 grid-cols-3 items-center gap-4">
        <span className={cellStyle}>勤務開始時間</span>
        <span className={cellStyle}>勤務終了時間</span>
        <span className={cellStyle}>勤務時間</span>
      </div>

      {/* 2行目。時間入力、勤務時間表示 */}
      <div className="grid h-12 grid-cols-3 items-center gap-4">
        <input
          type="time"
          name="work_start"
          value={workStart}
          onChange={handleWorkStartChange}
          className={inputStyle}
        ></input>
        <input
          type="time"
          name="work_end"
          value={workEnd}
          onChange={handleWorkEndChange}
          className={inputStyle}
        ></input>
        <span className={`${cellStyle} text-right`}>{working_hour}</span>
      </div>

      {/* 3行目。休憩時間追加ボタン */}
      <div className="grid h-12 grid-cols-3 items-center gap-4">
        <span className={cellStyle}>休憩時間</span>
        <span className={cellStyle}> </span>
        <button
          type="button"
          name="break"
          onClick={addBreak}
          className="bg-cyan-600 hover:bg-cyan-800 text-white font-medium py-1 px-4 rounded-full"
        >
          + 休憩を追加
        </button>
      </div>

      {/* 4行目。休憩時間入力 */}
      {breaks.map((b) => (
        <div key={b.id} className="grid h-12 grid-cols-3 items-center gap-4">
          <input
            type="time"
            name="break_start"
            value={b.start}
            onChange={(e) => updateBreak(b.id, 'start', e.target.value)}
            className={inputStyle}
          ></input>
          <input
            type="time"
            name="break_end"
            value={b.end}
            onChange={(e) => updateBreak(b.id, 'end', e.target.value)}
            className={inputStyle}
          ></input>
          <button
            type="button"
            name="delete_row"
            onClick={() => deleteBreak(b.id)}
            className="bg-rose-400 hover:bg-rose-500 text-white font-medium py-1 px-4 rounded-full"
          >
            削除
          </button>
        </div>
      ))}
    </div>
  );
};

export default LabourPage;
