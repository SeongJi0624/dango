import type { Metadata } from 'next';
import type { ReactElement, ReactNode } from 'react';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Dango',
  description: 'This is your story.',
};

type Props = Readonly<{
  children: ReactNode;
}>;

const RootLayout = ({ children }: Props): ReactElement => {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
