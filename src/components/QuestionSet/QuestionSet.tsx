import React, {useEffect, useRef, useState} from 'react';
import Question from '../Question/Question';
import Answer from '../Answer/Answer';
import {IQuestion} from '../../data/data';
import './QuestionSet.css';
import {AiFillFacebook, AiFillInstagram} from 'react-icons/ai';
import {FaTwitter} from 'react-icons/fa';
import axios from 'axios';

interface Props {
  id: number;
  nextQuestion: () => void;
}

const QuestionSet = ({id, nextQuestion}: Props) => {
  const [question, setQuestion] = useState<IQuestion>();
  const [isAnswered, setisAnswered] = useState(false);
  const [show, setShow] = useState(false);

  const usePrevious = (value: number) => {
    const ref = useRef<number>();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const prevId = usePrevious(id);

  const setIsAnsweredToTrue = () => {
    setisAnswered(true);
  };

  const nextQuestionClickHandler = () => {
    setShow(false);
    nextQuestion();
  };

  useEffect(() => {
    if (!question || id !== prevId) {
      axios.get<IQuestion>(`/questions/${id}`).then(response => {
        const question = response.data;
        const sortedChoices = question.Choices.sort((choice1, choice2) =>
          choice2.name.localeCompare(choice1.name)
        );
        question.Choices = sortedChoices;
        setQuestion(question);
        setShow(true);
      });
    }
  }, []);

  if (id !== prevId) {
    axios.get<IQuestion>(`/questions/${id}`).then(response => {
      const question = response.data;
      const sortedChoices = question.Choices.sort((choice1, choice2) =>
        choice2.name.localeCompare(choice1.name)
      );
      question.Choices = sortedChoices;
      setisAnswered(false);
      setQuestion(question);
      setShow(true);
    });
  }

  return (
    <>
      {question ? (
        <>
          <div className="QuestionSet" style={show ? {opacity: 1} : undefined}>
            <Question question={question.name} />
            <Answer
              isAnswered={isAnswered}
              choices={question.Choices}
              setIsAnsweredToTrue={setIsAnsweredToTrue}
            />
            {isAnswered ? null : (
              <div onClick={nextQuestionClickHandler} className="Skip">
                skip question
              </div>
            )}
            {isAnswered ? (
              <div className="Icons">
                <div className="Icon">
                  <AiFillFacebook size={40} />
                </div>
                <div className="Icon">
                  <AiFillInstagram size={40} />
                </div>
                <div className="Icon">
                  <FaTwitter size={35} />
                </div>
              </div>
            ) : null}
          </div>
          <div
            className="Next"
            style={isAnswered ? undefined : {visibility: 'hidden'}}
            onClick={nextQuestionClickHandler}
          />
        </>
      ) : null}
    </>
  );
};

export default QuestionSet;
