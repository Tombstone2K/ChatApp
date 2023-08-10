import './Kanban.css';
import './components/event.css';
import './components/task.css';

import React, {useCallback, useEffect } from 'react';
import EventBar from './components/EventBar';
import TaskBox from './components/TaskBox';

function Kanban({events,setEvents,currentEvent,setCurrentEvent,changeEvents,initEvent}) {
  
  const updateEvents = useCallback(async () => {
    try {
      if (!events.length) {
        await sessionStorage.setItem('events', JSON.stringify(initEvent));
        setEvents(JSON.parse(sessionStorage.getItem('events')));
      } else {
        await sessionStorage.setItem('events', JSON.stringify(events));
      }
    } catch (e) {
      console.error('Failed to modify events!');
    }
  }, [events]);

  // Set localStorage
  useEffect(() => {
    updateEvents();
    changeEvents();
  }, [events]);

  return (
    <div className='Kanban'>
      <EventBar
        events={events}
        setEvents={setEvents}
        currentEvent={currentEvent}
        setCurrentEvent={setCurrentEvent}
        changeEvents={changeEvents}
      />
      <TaskBox
        events={events}
        setEvents={setEvents}
        currentEvent={currentEvent}
        setCurrentEvent={setCurrentEvent}
        changeEvents={changeEvents}
      />
    </div>
  );
}

export default Kanban;
