// サンプル: トップページ(/)で表示中。直接編集せず、書き方を真似て自分のページに書いてください
'use client';

import { type ReactElement, useEffect, useState } from 'react';
import type { RandomCat } from '../../lib/Types.js';
import { CatImage } from '../CatImage';

export const CatImageFetcher = (): ReactElement => {
  const [catImage, setCatImage] = useState<null | RandomCat>(null);

  useEffect(() => {
    fetch('https://api.thecatapi.com/v1/images/search').then(async (res: Response) => {
      const json: Array<RandomCat> = (await res.json()) as Array<RandomCat>;

      setCatImage(json[0]!);
    });
  }, []);

  return (
    <div className="m-10 p-4 w-2/3 mx-auto shadow-lg border-2 rounded-2xl">
      <CatImage cat={catImage} />
    </div>
  );
};
