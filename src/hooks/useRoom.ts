import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { firebase, database } from 'services/firebase';

import { useAuth } from 'contexts/AuthContext';

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
    likes: Record<
      string,
      {
        authorId: string;
      }
    >;
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
  likeCount: number;
  likeId?: string;
};

export default function useRoom(roomId: string) {
  const history = useHistory();

  const { user } = useAuth();

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
          likeCount: Object.values(value.likes || {}).length,
          likeId: Object.entries(value.likes || {}).find(
            ([_, like]) => like.authorId === user?.id
          )?.[0],
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
  }, [history, roomId, user?.id]);

  return {
    questions,
    title,
  };
}
