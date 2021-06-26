import * as React from 'react';

import 'styles/button.scss';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
};

export default function Button({
  className = '',
  isOutlined = false,
  ...rest
}: ButtonProps = {}) {
  return (
    <button
      className={`button ${isOutlined ? '--outlined' : ''} ${className}`}
      {...rest}
    />
  );
}
