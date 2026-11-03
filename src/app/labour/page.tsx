'use client';

import type { ReactElement } from 'react';

const LabourPage = (): ReactElement => {
  return (
    <>
      {/* 1行目 */}
      <div>
        <span style={{ width: '150px', display: 'inline-block' }}>勤務開始時間</span>
        <span style={{ width: '150px', display: 'inline-block' }}>勤務終了時間</span>
        <span style={{ width: '150px', display: 'inline-block' }}>勤務時間</span>
      </div>

      {/* 2行目。時間入力、勤務時間表示 */}
      <div>
        <input
          type="time"
          name="work_start"
          style={{ width: '150px', display: 'inline-block' }}
        ></input>
        <input
          type="time"
          name="work_end"
          style={{ width: '150px', display: 'inline-block' }}
        ></input>
      </div>

      {/* 3行目。休憩時間追加ボタン */}
      <div>
        <span style={{ width: '150px', display: 'inline-block' }}>休憩時間</span>
        <span style={{ width: '150px', display: 'inline-block' }}> </span>
        <button type="button">+ 休憩を追加</button>
      </div>

      {/* 4行目。休憩時間入力 */}
      <div>
        <input
          type="time"
          name="break_start"
          style={{ width: '150px', display: 'inline-block' }}
        ></input>
        <input
          type="time"
          name="break_end"
          style={{ width: '150px', display: 'inline-block' }}
        ></input>
        <button type="button">削除</button>
      </div>
    </>
  );
};

export default LabourPage;
