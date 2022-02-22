import { Person } from "./datamodel";
import "./PersonPicker.css";

type PersonTileProps = {
  person: Person,
  selected: boolean,
  setSelected: (person: Person) => void
}
function PersonTile({ person, selected, setSelected }: PersonTileProps) {
  return (<button className={selected ? "PersonTile-Selected" : ""} onClick={() => setSelected(person)}>
    <img className="PersonTile-Photo" src={person.photoUrl} alt={person.name} />
  </button>)
}

type Props = {
  personState: [Person, (p: Person) => void],
  people: Person[]
}
export function PersonPicker({ personState, people }: Props) {
  const [person, setPerson] = personState;
  return (<div className="PersonPicker">
    {people.map(p => <PersonTile person={p} selected={p.id === person.id} setSelected={setPerson} />)}
  </div>);
}