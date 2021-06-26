import copyImg from 'assets/images/copy.svg';

import 'styles/room-code.scss';

export default function RoomCode() {
  return (
    <button type="button" className="room-code">
      <span className="room-code__copy-icon-container">
        <img src={copyImg} alt="Copiar código da sala" />
      </span>

      <span className="room-code__label">Sala #-Md7Vwzgqh1uf1UUtq9F</span>
    </button>
  );
}
