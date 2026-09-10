'use client';

import type { ReactElement } from 'react';
import type { Country } from '../../lib/Types.js';

type Props = Readonly<{
  countries: Array<Country>;
}>;

export const IncrementalSearchView = ({ countries }: Props): ReactElement => {
  return (
    <div>
      インクリメンタルサーチをここに作ろう（{countries.length}件のデータを受け取っています）
    </div>
  );
};
