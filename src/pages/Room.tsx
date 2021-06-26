import * as React from 'react';
import { useParams } from 'react-router-dom';

import { database } from 'services/firebase';

import { useAuth } from 'contexts/AuthContext';

import useRoom from 'hooks/useRoom';

import logoImg from 'assets/images/logo.svg';

import Button from 'components/Button';
import RoomCode from 'components/RoomCode';
import Question from 'components/Question';

import 'styles/room.scss';

type RoomParams = {
  id: string;
};

export default function Room() {
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { user } = useAuth();

  const { questions, title } = useRoom(roomId);

  const [newQuestion, setNewQuestion] = React.useState('');

  async function handleSendQuestion(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      throw new Error('Você precisa estar logado para criar perguntas!');
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion('');
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Let me ask" />

          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && (
            <span>
              {questions.length === 1
                ? '1 pergunta'
                : `${questions.length} perguntas`}
            </span>
          )}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            value={newQuestion}
            onChange={e => setNewQuestion(e.target.value)}
          />

          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta,{' '}
                <button type="button">faça seu login</button>.
              </span>
            )}
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>

        {questions.map(question => (
          <Question
            key={question.id}
            author={question.author}
            content={question.content}
          />
        ))}
      </main>
    </div>
  );
}
