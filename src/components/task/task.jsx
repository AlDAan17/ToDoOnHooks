/* eslint-disable */
import React, {useState, useRef, useEffect} from 'react';
import './task.css';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import PropTypes from 'prop-types';
import Timer from "../../Services/timer";

const Task = ({ label, onDeleted, onToggleDone, done, id, alreadyTime, timerOn, timerOff, nameOfClass, edit, time }) => {
  const [currentLabel, setCurrentLabel] = useState('');
  const [timeAgo, setTimeAgo] = useState(changeTime(time));
  const values = useRef({prevNameOfClass: '', flag: true, });
  const editInput = useRef(null);

  useEffect(()=>{
    let timerId = setTimeout(
        function run() {
          const timeAgoNew = changeTime(time);
          setTimeAgo(timeAgoNew);
          if (timeAgoNew.includes('second')) {
            timerId = setTimeout(run, 5000);
          } else {
            timerId = setTimeout(run, 30000);
          }
        },
        5000
    );
    return () => clearTimeout(timerId);
  }, [time])

  const editFn = () => {
    setCurrentLabel(label);
    values.current.prevNameOfClass = nameOfClass;
    edit(id, { nameOfClass: ' editing' }, editInput.current);
  };

  const editFnBlur = () => {
    const nameOfClass = values.current.prevNameOfClass;
    document.onkeydown = (evt) => {
      let isEscape = false;
      if ('key' in evt) {
        isEscape = evt.key === 'Escape' || evt.key === 'Esc';
      }
      if (isEscape) {
        edit(id, { nameOfClass, label });
        values.current.flag = true;
      }
    };
    if (values.current.flag) {
      edit(id, { nameOfClass, label });
      values.current.flag = true;
    }
  };

  const changeField = (event) => {
    setCurrentLabel(event.target.value)
  };

  const onSubmit = (event) => {
    event.preventDefault();

    if (!currentLabel.trim()) return;
    edit(id, { nameOfClass: values.current.prevNameOfClass, label: currentLabel.trim() });
  };

    const alreadyTimeFormat = new Timer(...alreadyTime).recountTime().transformToText().result();
    if (done) {
      nameOfClass += ' completed';
    }

    return (
      <span>
        <li className={nameOfClass} id="inputItem">
          <div className="view">
            <input className="toggle" type="checkbox" checked={done === true} onChange={() => onToggleDone(id)} />
            <label>
              <span className="description">{label}</span>
              <div className="created">
                <button type="button" aria-label="play" className="icon-play" onClick={() => timerOn(id)}/>
                 <button type="button" aria-label="pause" className="icon-pause" onClick={() => timerOff(id)}/>
                {alreadyTimeFormat}
              </div>
              <span className="created">{timeAgo}</span>
            </label>
            <button type="button" className="icon icon-edit" aria-label="Save" onClick={editFn} />
            <button type="button" className="icon icon-destroy" aria-label="Save" onClick={onDeleted} />
          </div>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              className="edit"
              value={currentLabel}
              onChange={changeField}
              ref={editInput}
              onBlur={editFnBlur}
            />
          </form>
        </li>
      </span>
    );
}

const changeTime = (time) => {
  return formatDistanceToNow(time, { includeSeconds: true, addSuffix: true });
}

Task.propTypes = {
  label: PropTypes.string.isRequired,
  onDeleted: PropTypes.func.isRequired,
  onToggleDone: PropTypes.func.isRequired,
  done: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  nameOfClass: PropTypes.string.isRequired,
  time: PropTypes.instanceOf(Date).isRequired,
  edit:PropTypes.func.isRequired,
  timerOn:PropTypes.func.isRequired,
  timerOff:PropTypes.func.isRequired,
  alreadyTime:PropTypes.arrayOf(Object).isRequired,
};

export default Task;