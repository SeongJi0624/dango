'use client';

import type { ReactElement } from 'react';

const cellStyle = { width: '150px', display: 'inline-block' } as const;
const boxStyle = { display: 'flex', background: '#EEFFFF', padding: '8px' };

const LabourPage = (): ReactElement => {
  return (
    <div style={boxStyle}>
      {/* 1行目 */}
      <div>
        <span style={cellStyle}>勤務開始時間</span>
        <span style={cellStyle}>勤務終了時間</span>
        <span style={cellStyle}>勤務時間</span>
      </div>

      {/* 2行目。時間入力、勤務時間表示 */}
      <p>
        <div>
          <input type="time" name="work_start" style={cellStyle}></input>
          <input type="time" name="work_end" style={cellStyle}></input>
        </div>
      </p>

      {/* 3行目。休憩時間追加ボタン */}
      <p>
        <div>
          <span style={cellStyle}>休憩時間</span>
          <span style={cellStyle}> </span>
          <button type="button">+ 休憩を追加</button>
        </div>
      </p>

      {/* 4行目。休憩時間入力 */}
      <p>
        <div>
          <input type="time" name="break_start" style={cellStyle}></input>
          <input type="time" name="break_end" style={cellStyle}></input>
          <button type="button">削除</button>
        </div>
      </p>
    </div>
  );
};

export default LabourPage;
