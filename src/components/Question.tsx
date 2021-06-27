import * as React from 'react';
import cx from 'classnames';

import 'styles/question.scss';

type QuestionProps = {
  children?: React.ReactNode;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  isAnswered?: boolean;
  isHighlighted?: boolean;
};

export default function Question({
  children,
  author,
  content,
  isAnswered = false,
  isHighlighted = false,
}: QuestionProps) {
  return (
    <div
      className={cx(
        'question',
        { '--answered': isAnswered },
        { '--highlighted': isHighlighted && !isAnswered }
      )}
    >
      <p>{content}</p>

      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>

        <div className="children-container">{children}</div>
      </footer>
    </div>
  );
}
