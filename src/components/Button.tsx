import type { FC, MouseEvent, PropsWithChildren, ReactElement } from 'react';

type Props = Readonly<{
  disabled?: boolean;
  className: string;
  onClick(e: MouseEvent<HTMLButtonElement>): void;
}>;

export const Button: FC<PropsWithChildren<Props>> = ({
  disabled,
  className,
  onClick,
  children,
}): ReactElement => {
  return (
    <button type="button" disabled={disabled} className={className} onClick={onClick}>
      {children}
    </button>
  );
};
