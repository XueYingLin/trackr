import { useState } from 'react';
import './App.css';
import { getActivities, getPeople } from './datamodel';
import { Day } from './Day';
import { Expectations } from './Expectations';
import { makeMutable } from './mutablestate';
import { PersonPicker } from './PersonPicker';

function App() {
  const people = getPeople();
  const personState = useState(people[0]);
  const dayState = useState(new Date());

  const person = personState[0];
  const activitiesState = useState(getActivities(person, dayState[0]))

  return (
    <div>
      <Day dayState={dayState} />
      <Expectations activities={makeMutable(activitiesState)} />
      <PersonPicker people={people} personState={personState} />
    </div>

  );
}

export default App;
