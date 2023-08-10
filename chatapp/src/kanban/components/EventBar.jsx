import React, {useCallback} from 'react';
import AddEventButton from './AddEventButton';

const EventBar = ({ events, setEvents, currentEvent, setCurrentEvent,changeEvents}) => {
  const handleAdd = useCallback(() => {
    const title = prompt('Enter the Title:');
    // Prevent Duplicated
   if (
      events.find((event) => event.title.toLowerCase() === title.toLowerCase())
    ) {
      alert('Event Already Existed');
      return; 
    }
    // Add new event
    if (title)
      setEvents((prev) => [
        ...prev,
        {
          title,
          ['To do']: [],
          ['In progress']: [],
          ['Completed']: [],
        },
      ]);

      changeEvents();
  }, [events, setEvents]);

  return (
    <div className='event-bar'>
      <h1 className='event-bar-title'>{localStorage.getItem('organisation')}</h1>
      {/* <AddEventButton handleClick={handleAdd} /> */}
      <div className='add-button' onClick={handleAdd}>
      +
    </div>
      <div className='event-container'>
        {events.map((item) => (
          <div
            key={item.title}
            className={`event over-hide ${currentEvent.title === item.title ? 'selected-event' : ''
              }`}
            onClick={() => {setCurrentEvent(item);
            console.log(events);
          console.log(typeof(events))}}
          >
            {item.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventBar;
