import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button/Button";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import { getLessonByIdAction } from "../../redux/actions/LessonActions";

const lessons = [
  {
    id: 1,
    name: "Bài 1 là đây",
    description: "Bài 1 là bài 1. Sau khi học xong bài 1 sẽ sang bài 2.",
    video_link: "http://media.w3.org/2010/05/bunny/movie.mp4",
  },
  {
    id: 2,
    name: "Bài 2 là đây",
    description: "Bài 2 là bài 2. Sau khi học xong bài 2 sẽ sang bài 3.",
    video_link: "http://media.w3.org/2010/05/bunny/movie.mp4",
  },
  {
    id: 3,
    name: "Bài 3 là đây",
    description: "Bài 3 là bài 3. Sau khi học xong bài 3 sẽ sang bài 4.",
    video_link: "http://media.w3.org/2010/05/bunny/movie.mp4",
  },
  {
    id: 4,
    name: "Bài 4 là đây",
    description: "Bài 4 là bài 4. Sau khi học xong bài 4 sẽ sang bài 5.",
    video_link: "http://media.w3.org/2010/05/bunny/movie.mp4",
  },
  {
    id: 5,
    name: "Bài 5 là đây",
    description: "Bài 5 là bài 5. Sau khi học xong bài 5 sẽ sang bài 6.",
    video_link: "http://media.w3.org/2010/05/bunny/movie.mp4",
  },
  {
    id: 6,
    name: "Bài 6 là đây",
    description: "Bài 6 là bài 6. Sau khi học xong bài 6 sẽ sang bài 7.",
    video_link: "http://media.w3.org/2010/05/bunny/movie.mp4",
  },
  {
    id: 7,
    name: "Bài 7 là đây",
    description: "Bài 7 là bài 7. Sau khi học xong bài 7 sẽ sang bài 8.",
    video_link: "http://media.w3.org/2010/05/bunny/movie.mp4",
  },
  {
    id: 8,
    name: "Bài 8 là đây",
    description: "Bài 8 là bài 8. Sau khi học xong bài 8 sẽ sang bài 9.",
    video_link: "http://media.w3.org/2010/05/bunny/movie.mp4",
  },
];

export const LessonDetail = (props) => {
  let { lessonId, courseId } = props.match.params;

  const [indexOfLesson, setIndexOfLesson] = useState(
    lessons.findIndex((item) => item.id === parseInt(lessonId))
  );

  const { userLogin } = useSelector((state) => state.UserReducer);

  console.log("user", userLogin);
  const { lesson } = useSelector((state) => state.LessonReducer);
  // const { recordsDefault } = useSelector((state) => state.RecordReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getLessonByIdAction(parseInt(lessonId)));
  }, []);
  // let listAudioTemp = recordsDefault.filter((item) => item.id === userLogin.id);

  // const renderAudio = () => {
  //   return listAudioTemp.map((item, index) => {
  //     let testAudioRecord = URL.createObjectURL(item);

  //     console.log("testAudioRecord", testAudioRecord);
  //     return (
  //       <audio
  //         src={testAudioRecord}
  //         controls
  //         className="inline-block"
  //         key={index}
  //       />
  //     );
  //   });
  // };

  return (
    <>
      <div className=" container my-10 text-3xl font-bold">{lesson.name}</div>
      <div className="grid grid-cols-3 gap-3 container mt-10">
        <div className="col-span-2">
          <VideoPlayer lessonId={lessonId} lesson={lesson} />
          <div className="flex justify-between my-10">
            <Button
              textContent="Prev Lesson"
              className=" !rounded-none col-span-1"
              onClick={() => {
                const { id } = lessons[indexOfLesson];
                props.history.push(`/courses/${courseId}/lessons/${id - 1}`);
                dispatch(getLessonByIdAction(id - 1));
                setIndexOfLesson(indexOfLesson - 1);
              }}
              disabled={indexOfLesson === 0 ? true : false}
            ></Button>
            <Button
              textContent="Next Lesson"
              className=" !rounded-none col-span-1"
              onClick={() => {
                const { id } = lessons[indexOfLesson];
                props.history.push(`/courses/${courseId}/lessons/${id + 1}`);
                dispatch(getLessonByIdAction(id + 1));
                setIndexOfLesson(indexOfLesson + 1);
              }}
              disabled={indexOfLesson === lessons.length - 1 ? true : false}
            ></Button>
          </div>
        </div>
        <div className="col-span-1 bg-green-400">{/* {renderAudio()} */}</div>
      </div>
    </>
  );
};
