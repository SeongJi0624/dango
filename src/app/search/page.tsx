import { promises } from 'fs';
import { join } from 'path';
import type { ReactElement } from 'react';
import type { Country } from '../../lib/Types.js';
import { IncrementalSearchView } from './IncrementalSearchView';

const IncrementalSearchPage = async (): Promise<ReactElement> => {
  const buffer = await promises.readFile(join(process.cwd(), 'json', 'countries.json'));
  const countries = JSON.parse(buffer.toString()) as Array<Country>;

  return <IncrementalSearchView countries={countries} />;
};

export default IncrementalSearchPage;
