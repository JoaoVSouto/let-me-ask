import copyImg from 'assets/images/copy.svg';

import 'styles/room-code.scss';

type RoomCodeProps = {
  code: string;
};

export default function RoomCode({ code }: RoomCodeProps) {
  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(code);
  }

  return (
    <button
      type="button"
      className="room-code"
      onClick={copyRoomCodeToClipboard}
    >
      <span className="room-code__copy-icon-container">
        <img src={copyImg} alt="Copiar código da sala" />
      </span>

      <span className="room-code__label">Sala #{code}</span>
    </button>
  );
}
