import styled from "styled-components";
import { CgSun } from "react-icons/cg";
import { HiMoon } from "react-icons/hi";

const Toggle = styled.button`
  cursor: pointer;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  border: none;
  outline: none;
  transition: all 0.5s ease;
  position: fixed; /* Fixed positioning for top right corner */
  top: 10px; /* Adjust top padding as needed */
  right: 10px; /* Adjust right padding as needed */
  z-index: 999; /* Ensure button is above other content */
`;

const Page = styled.div`
  display: flex;
  justify-content: left; /* Align items to the left */
  align-items: center;
  left: 0;
  transition: all 0.5s ease;
  position: relative; /* Relative positioning for the container */

`;

function Splash({ theme, setTheme }) {
  const icon = theme === "light" ? <HiMoon size={40} /> : <CgSun size={40} />;

  return (
    <Page>
      <Toggle onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        {icon}
      </Toggle>
    </Page>
  );
}

export default Splash;

