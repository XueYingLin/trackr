import "./IconButton.css"

type Props = {
  children: JSX.Element,
  onClick?: () => void,
}
export function IconButton({ children, onClick }: Props) {
  return <button onClick={onClick} className="IconButton">{children}</button>
}
