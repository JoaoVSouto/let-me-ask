import { useParams } from 'react-router-dom';

import useRoom from 'hooks/useRoom';

import logoImg from 'assets/images/logo.svg';

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
          />
        ))}
      </main>
    </div>
  );
}
