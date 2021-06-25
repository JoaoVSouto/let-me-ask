import * as React from 'react';

import 'styles/button.scss';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className = '', ...rest }: ButtonProps = {}) {
  return <button className={`button ${className}`} {...rest} />;
}
