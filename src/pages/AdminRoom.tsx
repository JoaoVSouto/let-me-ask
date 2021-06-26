import { useParams } from 'react-router-dom';

import { database } from 'services/firebase';

import useRoom from 'hooks/useRoom';

import logoImg from 'assets/images/logo.svg';
import deleteImg from 'assets/images/delete.svg';

import RoomCode from 'components/RoomCode';
import Question from 'components/Question';
import Button from 'components/Button';

import 'styles/room.scss';

type RoomParams = {
  id: string;
};

export default function AdminRoom() {
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { questions, title } = useRoom(roomId);

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Let me ask" />

          <div>
            <RoomCode code={roomId} />
            <Button type="button" isOutlined>
              Encerrar sala
            </Button>
          </div>
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

        {questions.map(question => (
          <Question
            key={question.id}
            author={question.author}
            content={question.content}
          >
            <button
              type="button"
              onClick={() => handleDeleteQuestion(question.id)}
            >
              <img src={deleteImg} alt="Remover pergunta" />
            </button>
          </Question>
        ))}
      </main>
    </div>
  );
}
