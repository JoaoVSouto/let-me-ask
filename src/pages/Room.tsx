import logoImg from 'assets/images/logo.svg';

import Button from 'components/Button';
import RoomCode from 'components/RoomCode';

import 'styles/room.scss';

export default function Room() {
  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Let me ask" />

          <RoomCode />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala React Q&A</h1>
          <span>4 perguntas</span>
        </div>

        <form>
          <textarea placeholder="O que você quer perguntar?" />

          <div className="form-footer">
            <span>
              Para enviar uma pergunta,{' '}
              <button type="button">faça seu login</button>.
            </span>
            <Button type="submit">Enviar pergunta</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
