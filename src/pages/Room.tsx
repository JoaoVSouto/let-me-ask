import * as React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { firebase, database } from 'services/firebase';

import { useAuth } from 'contexts/AuthContext';

import logoImg from 'assets/images/logo.svg';

import Button from 'components/Button';
import RoomCode from 'components/RoomCode';

import 'styles/room.scss';

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
  }
>;

type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
};

type RoomParams = {
  id: string;
};

export default function Room() {
  const history = useHistory();

  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { user } = useAuth();

  const [newQuestion, setNewQuestion] = React.useState('');
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [title, setTitle] = React.useState('');

  React.useEffect(() => {
    function handleRoomValueChange(room: firebase.database.DataSnapshot) {
      const roomData = room.val();

      if (!roomData) {
        history.push('/');
        return;
      }

      const firebaseQuestions: FirebaseQuestions = roomData.questions || {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(
        ([key, value]) => ({
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
        })
      );

      setTitle(roomData.title);
      setQuestions(parsedQuestions);
    }

    const roomRef = database.ref(`rooms/${roomId}`);
    roomRef.once('value', handleRoomValueChange);

    return () => {
      roomRef.off('value', handleRoomValueChange);
    };
  }, [history, roomId]);

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
      </main>
    </div>
  );
}
