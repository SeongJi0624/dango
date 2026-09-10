// サンプル: トップページ(/)で表示中。直接編集せず、書き方を真似て自分のページに書いてください
import type { ReactElement } from 'react';
import type { Country } from '../../lib/Types.js';

type Props = Readonly<{
  countries: Array<Country>;
}>;

export const CountryList = ({ countries }: Props): ReactElement => {
  return (
    <div className="m-10 p-4 w-2/3 mx-auto shadow-lg border-2 rounded-2xl">
      <ul className="list-none">
        {countries.map((country: Country) => {
          return (
            <li key={country.alpha2} className="text-gray-800 even:bg-teal-100 text-lg">
              <div className="my-1">{country.jpnName}</div>
              <div className="my-1">{country.engName}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
