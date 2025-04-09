import "./Header.css";

function Header({ title, time }) {
  return (
    <div className="Header">
      <h1>{title}</h1>
      <h2>{time}</h2>
    </div>
  );
}

export default Header;
