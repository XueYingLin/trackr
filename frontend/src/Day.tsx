import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import "./Day.css";
import { addDays, getHeaderDisplayDate, isToday } from "./dates";

type DayHeaderProps = {
  date: Date,
  navigate: DateNavigation,
}
function DayHeader({ date, navigate }: DayHeaderProps) {
  return (<div className="Day-Header">
    <button style={{ visibility: navigate.previousDate ? "visible" : "hidden" }} onClick={navigate.previousDate}><FontAwesomeIcon icon={faArrowLeft} /></button>
    <span className="Day-Title">{getHeaderDisplayDate(date)}</span>
    <button style={{ visibility: navigate.nextDate ? "visible" : "hidden" }} onClick={navigate.nextDate}><FontAwesomeIcon icon={faArrowRight} /></button>
  </div>
  )
}

interface DateNavigation {
  previousDate: (() => void) | undefined,
  nextDate: (() => void) | undefined,
}

type Props = {
  dayState: [Date, (d: Date) => void]
}
export function Day({ dayState }: Props) {
  const [date, setDate] = dayState;

  const navigator = {
    previousDate: () => { setDate(addDays(date, -1)) },
    nextDate: isToday(date) ? undefined : () => { setDate(addDays(date, 1)) }
  }

  return (<div className="Day">
    <DayHeader date={date} navigate={navigator} />
  </div>)
}
