import type { ReactElement } from 'react';
import type { Country } from '../../lib/Types.js';
import { CatImageFetcher } from './CatImageFetcher';
import { Counter } from './Counter';
import { CountryList } from './CountryList';
import { FormShowcase } from './FormShowcase';
import { LabourHoursCalculator } from './LabourHoursCalculator';
import { MaskedCode } from './MaskedCode';
import { SimpleCounter } from './SimpleCounter';
import { Stopwatch } from './Stopwatch';

type Props = Readonly<{
  countries: Array<Country>;
}>;

export const HomeView = ({ countries }: Props): ReactElement => {
  return (
    <>
      <SimpleCounter />
      <Counter />
      <MaskedCode />
      <LabourHoursCalculator />
      <CountryList countries={countries} />
      <FormShowcase />
      <Stopwatch />
      <CatImageFetcher />
    </>
  );
};
