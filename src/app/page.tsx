import { promises } from 'fs';
import { join } from 'path';
import type { ReactElement } from 'react';
import { HomeView } from '../components/samples/HomeView';
import type { Country } from '../lib/Types.js';

const HomePage = async (): Promise<ReactElement> => {
  const buffer = await promises.readFile(join(process.cwd(), 'json', 'countries.json'));
  const countries = JSON.parse(buffer.toString()) as Array<Country>;

  return <HomeView countries={countries} />;
};

export default HomePage;
