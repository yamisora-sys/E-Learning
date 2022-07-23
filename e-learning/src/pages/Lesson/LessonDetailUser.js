import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import AudioComponent from "../../components/AudioPlayer/AudioPlayer";
import { getOneLessonByIdAction } from "../../redux/actions/LessonActions";
import {
  getAllRecordsByLessonIdAction,
  saveRecordAction,
} from "../../redux/actions/RecordActions";
import { getCourseDetailAction } from "../../redux/actions/CourseAction";
import LessonSlider from "../Courses/LessonSlider";
import "./LessonDetailUser.css";
import RecordListAll from "../RecordList/RecordListAll";
import { USER_LOGIN } from "../../utils/settings/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import storageFirebase from "../../utils/settings/firebaseConfig";
import { useReactMediaRecorder } from "react-media-recorder";
import { getTimedatasByLessonIdAction } from "../../redux/actions/TimedataActions";

export const LessonDetailUser = (props) => {
  const userLogin = JSON.parse(localStorage.getItem(USER_LOGIN));
  const dispatch = useDispatch();
  let { lessonId, courseId } = props.match.params;

  const { courseDetail } = useSelector((state) => state.CourseReducer);

  const { lesson } = useSelector((state) => state.LessonReducer);
  // const { recordsDefault } = useSelector((state) => state.RecordReducer);
  const videoElement = useRef(null);

  const { timedatasDefault } = useSelector((state) => state.TimedataReducer);
  console.log("timedatasDefault", timedatasDefault);
  const [isStart, setIsStart] = useState(false);
  const [isStop, setIsStop] = useState(false);
  const [displayHidden, setDisplayHidden] = useState("hidden");
  const [disable, setDisable] = useState(false);
  const [minute, setMinute] = useState("0");
  const [second, setSecond] = useState("0");

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getCourseDetailAction(courseId));
    dispatch(getOneLessonByIdAction(courseId, lessonId));
    dispatch(getAllRecordsByLessonIdAction(lessonId));
    dispatch(getTimedatasByLessonIdAction(lessonId));
  }, []);

  useEffect(() => {
    const timeData = timedatasDefault;
    const interval = setInterval(async () => {
      const elapsed_sec = await videoElement.current.currentTime;
      // calculations
      let elapsed_ms = Math.floor(elapsed_sec * 1000);
      let ms = elapsed_ms % 1000;
      let min = Math.floor(elapsed_ms / 60000);
      let seconds = Math.floor((elapsed_ms - min * 60000) / 1000);

      for (let index = 0; index < timeData.length; index++) {
        const item = timeData[index];
        if (min === item.minute && seconds === item.second && ms < 200) {
          setMinute(min);
          setSecond(seconds);
          videoElement.current.pause();
          setDisplayHidden("");
          setIsStop(false);
          timeData.shift();
        }
      }
    }, 200);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const { startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder(
    {
      video: false,
      audio: true,
    }
  );

  const stopTimer = () => {
    setIsStart(false);
    stopRecording();

    setDisable(!disable);
  };

  const handleSave = async () => {
    const fileName = `${new Date().getTime()}.wav`;
    const audioBlob = await fetch(mediaBlobUrl).then((r) => r.blob());

    const storageRef = ref(storageFirebase, "audio/" + fileName);
    // 'file' comes from the Blob or File API
    uploadBytes(storageRef, audioBlob).then((snapshot) => {
      getDownloadURL(storageRef).then(async (url) => {
        console.log("url record", url);
        console.log("Uploaded a blob or file!");
        //save url to database
        const data = new FormData();
        data.append("user_id", userLogin.id);
        data.append("lesson_id", lesson.id);
        data.append("url", url);
        data.append("minute", minute);
        data.append("second", second);
        dispatch(saveRecordAction(data, lesson.id));
      });
    });
  };
  const { listAudio } = useSelector((state) => state.LessonReducer);
  useEffect(() => {}, [listAudio]);
  let listAudioTemp = listAudio;
  let recordsUser = listAudioTemp?.filter((item) => {
    // console.log(item);
    return item.user_id === userLogin.id && item;
  });


  const renderAudio = () => {
    return recordsUser?.map((item, index) => {
      console.log("recordsUser-item", item);
      return (
        <>
          <AudioComponent record={item} />
        </>
      );
    });
  };

  const renderDescription = lesson?.description
    ?.split(";")
    .map((item, index) => {
      return (
        <li className="my-1" style={{ maxInlineSize: "none" }} key={index}>
          <div className="flex align-center relative">
            <span className="dot absolute"></span>
            <span className="pl-8 text-medium font-medium tracking-tight">
              {item}
            </span>
          </div>
        </li>
      );
    });
  return (
    <>
      <div className="background-lesson grid grid-cols-6 border border-gray-200 rounded-2xl mx-16">
        <div className="col-span-4 py-6 px-12">
          <nav
            className="bg-white	 drop-shadow-lg flex px-5 pt-5 text-gray-700 border border-gray-200 rounded-lg"
            aria-label="Breadcrumb"
          >
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <NavLink
                  to="/"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                  </svg>
                  Home
                </NavLink>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <NavLink
                    to={`course/${courseId}`}
                    className="ml-1 text-sm font-medium text-gray-700 hover:text-gray-900 md:ml-2 dark:text-gray-400 dark:hover:text-white"
                  >
                    {lesson.course_name}
                  </NavLink>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                    {lesson.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Thay Component VideoPlayer  */}
          <div className="mt-4">
            <div className="relative">
              <video
                controls
                ref={videoElement}
                poster={courseDetail?.banner}
                src={lesson?.video_link}
                className="w-full drop-shadow-lg rounded-lg"
              ></video>
              <div className={`video-audio__overlay  ${displayHidden} `}></div>
              <div className={`audio-record  ${displayHidden} text-center`}>
                {!isStop ? (
                  <>
                    <p className="mx-auto text-black font-bold">
                      Nhấn để thu âm
                    </p>
                    <button
                      onClick={() => {
                        if (!isStart) {
                          startRecording();
                        }
                        setIsStart(!isStart);
                        setDisable(!disable);
                      }}
                      disabled={disable}
                    >
                      <i
                        className="fa fa-microphone  text-black "
                        style={{ fontSize: 40 }}
                      ></i>
                    </button>
                    <div className="flex gap-1 justify-center mt-2">
                      <button
                        className="bg-red-700 shadow-md rounded-sm p-1 text-white text-lg "
                        style={{ width: 100 }}
                        disabled={!disable}
                        onClick={() => {
                          stopRecording();
                          setIsStart(!isStart);
                          setDisable(!disable);
                          setIsStop(!isStop);
                        }}
                      >
                        Stop
                      </button>
                      <button
                        className="bg-white shadow-md rounded-sm p-1 text-black text-lg "
                        style={{ width: 100 }}
                        disabled={!disable}
                        onClick={stopTimer}
                      >
                        Clear
                      </button>
                    </div>
                  </>
                ) : (
                  <div>
                    <audio
                      src={mediaBlobUrl}
                      controls
                      className="inline-block"
                    />

                    <div className="mt-5">
                      <button
                        className="bg-blue-600 shadow-xl rounded-sm p-1 text-white text-lg  mr-2 "
                        style={{ width: 100 }}
                        onClick={() => {
                          setIsStop(false);
                          stopTimer();
                          setDisable(false);
                        }}
                      >
                        Ghi lại?
                      </button>
                      <button
                        className="bg-blue-600 shadow-xl rounded-sm p-1 text-white text-lg "
                        style={{ width: 100 }}
                        onClick={() => {
                          setIsStop(false);
                          setDisplayHidden("hidden");
                          handleSave();
                          videoElement.current.play();
                        }}
                      >
                        Tiếp tục?
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button className="mt-4 text-base inline-flex items-center font-bold leading-sm uppercase px-3 py-1 rounded bg-white text-gray-700 border drop-shadow-lg">
            Description
          </button>
          <div
            id="collapseTwo"
            className="bg-white rounded-lg border  border-gray-300 accordion-collapse collapse show"
          >
            <div className="accordion-body py-4 px-5">
              <ul className=" mb-2 text-base font-bold tracking-tight text-gray-800 dark:text-white">
                {renderDescription}
              </ul>
            </div>
          </div>
        </div>

        {/* <div className="col-span-1 bg-green-400 mt-10">
        {renderAudio()}
        </div> */}
        <div className="mt-28 col-span-2 flex-1 p:2 sm:p-6 justify-between flex flex-col h-120 bg-white h-fit rounded-2xl drop-shadow-xl">
          <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
            <div className="relative flex items-center space-x-4">
              <div className="relative">
                <span className="absolute text-green-500 right-0 bottom-0">
                  <svg width="10" height="10">
                    <circle cx="4" cy="4" r="4" fill="currentColor"></circle>
                  </svg>
                </span>
                <img
                  src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                  alt=""
                  className="w-5 sm:w-8 h-5 sm:h-8 rounded-full"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <div className="text-lg mt-1 flex items-center">
                  <span className="font-bold text-gray-700 mr-3">
                    Anderson Vanhron
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            id="messages"
            className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
          >
          {renderAudio()}
            {/* <div className="chat-message">
              <div className="flex items-end">
                <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                  <div>
                    <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                      Can be verified on any platform using docker
                    </span>
                  </div>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                  alt="My profile"
                  className="w-6 h-6 rounded-full order-1"
                />
              </div>
            </div>
            <div className="chat-message">
              <div className="flex items-end justify-end">
                <div className="flex flex-col text-xs max-w-xs mx-2">
                  <div>
                    <AudioComponent />
                  </div>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                  alt="My profile"
                  className="w-6 h-6 rounded-full order-2"
                />
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <div className="mx-16">
        <div className="mt-10 mb-4 ml-4 text-base inline-flex items-center font-bold leading-sm uppercase px-3 py-1 rounded bg-white text-gray-700 border drop-shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-hard-drive mr-2"
          >
            <line x1="22" y1="12" x2="2" y2="12"></line>
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
            <line x1="6" y1="16" x2="6.01" y2="16"></line>
            <line x1="10" y1="16" x2="10.01" y2="16"></line>
          </svg>
          Lessons in this course
        </div>
        <LessonSlider lessons={courseDetail?.lessons} />
      </div>
      <div>
        <div className="background-record pb-20">
          <div className="flex items-center justify-center pt-20 mb-20">
            <span className="line-text text-4xl font-bold">
              Student Records
            </span>
          </div>
          <RecordListAll lesson={lesson} />
        </div>
      </div>
    </>
  );
};
