import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { firebase, database } from 'services/firebase';

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

type QuestionData = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
};

export default function useRoom(roomId: string) {
  const history = useHistory();

  const [questions, setQuestions] = React.useState<QuestionData[]>([]);
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
    roomRef.on('value', handleRoomValueChange);

    return () => {
      roomRef.off('value', handleRoomValueChange);
    };
  }, [history, roomId]);

  return {
    questions,
    title,
  };
}
