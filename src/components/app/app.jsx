/* eslint-disable */
import React, {useState, useRef} from 'react';
import './app.css';
import NewTaskForm from '../new-task-form';
import TaskList from '../task-list';
import Footer from '../footer';

const App = () => {
  const data = useRef({maxId:100, timers:{}})
  const [filter, setFilter] = useState('all');
  const [todoData, setTodoData] = useState([]);
  const [term, setTerm] = useState('');

  const onTimerOn = (id) => {
    if (data.current.timers[id]) return;
    data.current.timers[id] = setInterval(() => {
      const i = todoData.findIndex((el) => el.id === id);
      if(todoData[i].done) return;
      const [min, sec] = todoData[i].alreadyTime;
      console.log('todoData is', todoData[i].alreadyTime)
      onEditing(id, {alreadyTime: [min, sec + 1]});
    },1000);
  };

  const onTimerOff = (id) => {
    clearInterval(data.current.timers[id]);
    delete data.current.timers[id];
  };

  const onEditing = (id, obj) => {
   setTodoData((prevState) => {
     const index = prevState.findIndex((el) => el.id === id);
     const oldItem = prevState[index];
     const newItem = { ...oldItem, ...obj };
     console.log('test', newItem)
     return [...todoData.slice(0, index), newItem, ...todoData.slice(index + 1)];
   });
  };

  const onDeleteCompleted = () => {
    setTodoData(() => {
      return todoData.filter((item) => {
        const { done, id  } = item;
        if(done) onTimerOff(id);
        return done === false;
      });
    })
  };

  const onFilterChange = (filterItem) => {
    setFilter(filterItem);
  };

  const onToggleDone = (id) => {
    setTodoData(prevState => {
      if(!todoData.done) onTimerOff(id);
      return toggleProperty(todoData, id, 'done');
    })
  };

  const onChangeEditMode = (id) => {
    setTodoData(prevState => {
      return toggleProperty(todoData, id, 'editMode');
    });
  };

  const deleteItem = (id) => {
    setTodoData(() => {
      onTimerOff(id);
      const idx = todoData.findIndex((el) => el.id === id);
      return [...todoData.slice(0, idx), ...todoData.slice(idx + 1)];
    });
  };

  const addItem = (text, alreadyTime) => {
    const newItem = createTodoItem(text, alreadyTime);
    setTodoData((prevState) => [...prevState, newItem])
  };

  const search = (items, term) => {
    console.log(items)
    return items.filter((item) => {
      return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1;
    });
  }

  const filterItems = (items, filterItem) => {
    switch (filterItem) {
      case 'all':
        return items;
      case 'active':
        return items.filter((item) => !item.done);
      case 'completed':
        return items.filter((item) => item.done);
      default:
        return items;
    }
  }

  const toggleProperty = (arr, id, propName) => {
    const idx = arr.findIndex((el) => el.id === id);
    const oldItem = arr[idx];
    const newItem = { ...oldItem, [propName]: !oldItem[propName] };

    return [...arr.slice(0, idx), newItem, ...arr.slice(idx + 1)];
  }

  const createTodoItem = (label, alreadyTime) => {
    const id = data.current.maxId;
    data.current.maxId += 1;
    return {
      label,
      done: false,
      editMode: false,
      filter: 'all',
      nameOfClass: 'active',
      time: new Date(),
      id,
      alreadyTime,
    };
  }

    const visibleItems = filterItems(search(todoData, term), filter);
    const doneCount = todoData.filter((el) => el.done).length;
    const todoCount = todoData.length - doneCount;
    return (
      <section className="todoapp">
        <NewTaskForm onItemAdded={addItem} />
        <TaskList
          todos={visibleItems}
          onDeleted={deleteItem}
          onToggleDone={onToggleDone}
          todoData={todoData}
          onChangeEditMode={onChangeEditMode}
          edit={onEditing}
          timerOn={onTimerOn}
          timerOff={onTimerOff}
        />
        <Footer
          done={todoCount}
          filter={filter}
          onFilterChange={onFilterChange}
          onDeleteCompleted={onDeleteCompleted}
        />
      </section>
    );
}

export default App;
