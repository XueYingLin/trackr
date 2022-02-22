import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Activities, CompletionState, Expectation } from "./datamodel";
import "./Expectations.css";
import { faPlayCircle, faTicketAlt, faCheckSquare as checkedIcon } from '@fortawesome/free-solid-svg-icons'

import { faSquare as uncheckedIcon } from '@fortawesome/free-regular-svg-icons'
import { IconButton } from "./IconButton";
import { MutableState } from "./mutablestate";

type ControlProps = {
  activities: MutableState<Activities>,
  id: string
}

function PassControl({ id, activities }: ControlProps) {
  return <IconButton><FontAwesomeIcon icon={faTicketAlt} /></IconButton>
}

function BooleanActivityControl({ id, activities }: ControlProps) {
  const isDone = activities.get().getCompletionState(id) === CompletionState.Done;
  const icon = isDone ? checkedIcon : uncheckedIcon;

  const toggleState = () => {
    const newState = isDone ? CompletionState.NotStarted : CompletionState.Done;
    const newActivities = activities.get().setCompletionState(id, newState);
    activities.set(newActivities);
  }

  return <IconButton onClick={toggleState}><FontAwesomeIcon icon={icon} /></IconButton>;
}

function TimeActivityControl({ id, activities }: ControlProps) {
  return <IconButton><FontAwesomeIcon icon={faPlayCircle} /></IconButton>
}

type ExpectationProps = {
  expectation: Expectation,
  activities: MutableState<Activities>,
}
function ExpectationRow({ expectation, activities }: ExpectationProps) {
  const todayMinutes = expectation.expectedTime[new Date().getDay()];

  var title = expectation.activityName;
  if (todayMinutes) {
    title += ` - ${todayMinutes} minutes`;
  }

  const classes = ["ExpectationRow"]

  const completionState = activities.get().getCompletionState(expectation.id);

  var control;
  if (completionState === CompletionState.Pass) {
    control = <PassControl id={expectation.id} activities={activities} />
  } else if (completionState === CompletionState.Done) {
    control = <BooleanActivityControl id={expectation.id} activities={activities} />
  } else if (activities.get().isTimeBased(expectation.id)) {
    control = <TimeActivityControl id={expectation.id} activities={activities} />
  } else {
    control = <BooleanActivityControl id={expectation.id} activities={activities} />
  }

  return <div className={classes.join(" ")}>
    <span>{title}</span>
    <span className="ExpectationRow-Controls">
      {control}
    </span>
  </div>
}

type Props = {
  activities: MutableState<Activities>
}
export function Expectations({ activities }: Props) {
  return <div>{activities.get().getExpectations().map(e => <ExpectationRow activities={activities} expectation={e} />)}</div>
}

