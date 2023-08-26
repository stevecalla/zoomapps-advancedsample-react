import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";

function Header(props) {
  const navLinks = props.navLinks;

  const [activeStates, setActiveStates] = useState(Array(navLinks.length).fill(false));

  const handleNavLinkClick = (index) => {
    const updatedStates = [...activeStates];
    updatedStates[index] = !updatedStates[index];
    setActiveStates(updatedStates);
  };

  useEffect(() => {
    const navLinkElements = document.querySelectorAll(".nav-link");

    navLinkElements.forEach((navLinkElement, index) => {
      const liElement = navLinkElement.closest("li");
      if (navLinkElement.classList.contains("active")) {
        liElement.classList.add("active");
      } else {
        liElement.classList.remove("active");
      }
    });
  }, [activeStates]);

  return (
    <header>
      <ul>
        {Object.entries(navLinks).map((navLink, index) => {
          const route = navLink[0];
          const navName = navLink[1];
          return (
            <li
              key={route}
              className={activeStates[index] ? "active" : ""}
              onClick={() => handleNavLinkClick(index)}
            >
              <NavLink activeClassName="active" to={route}>
                {navName}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </header>
  );
}

export default Header;
