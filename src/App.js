import React, { useEffect } from "react";
import styled from "styled-components";

//images
import Post from "./Components/Post";

//data

function App() {
  useEffect(() => {
    if (!window.localStorage.getItem("comments")) {
      window.localStorage.setItem("comments", []);
    }
  }, []);

  return (
    <Container>
      <div className="container">
        <Post />
      </div>
    </Container>
  );
}

export default App;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
