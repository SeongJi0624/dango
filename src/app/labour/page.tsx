'use client';

import type { ReactElement } from 'react';

const LabourPage = (): ReactElement => {
  return (
    <>
      <div>
        <span style={{ width: '200px', display: 'inline-block' }}>勤務開始時間</span>
        <span style={{ width: '200px', display: 'inline-block' }}>勤務終了時間</span>
        <span style={{ width: '200px', display: 'inline-block' }}>勤務時間</span>
      </div>
      <div>
        <input type="time" name="start"></input>
        <input type="time" name="end"></input>
      </div>
    </>
  );
};

export default LabourPage;
