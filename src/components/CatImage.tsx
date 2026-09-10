import type { FC, ReactElement } from 'react';
import type { RandomCat } from '../lib/Types.js';

type Props = Readonly<{
  cat: null | RandomCat;
}>;

export const CatImage: FC<Props> = ({ cat }: Props): null | ReactElement => {
  if (cat === null) {
    return null;
  }

  return <img src={cat.url} height={cat.height} width={cat.width} alt="cat" className="w-full" />;
};
