import PropTypes from "prop-types";
import Button from "./Button";
import { useLocation } from "react-router-dom";

const Header = ({ title, showAddTask, setShowAddTask }) => {
  // const onClick = () => {
  //   console.log("Click");
  // };
  const location = useLocation();
  return (
    <header className="header">
      <h1>{title}</h1>
      {location.pathname === "/" && (
        <Button
          onClick={() => setShowAddTask(!showAddTask)}
          text={showAddTask ? "Close" : "Add"}
          color={showAddTask ? "red" : "green"}
        />
      )}
    </header>
  );
};

Header.defaultProps = {
  title: "Task Tracker",
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
