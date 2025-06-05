import styled from "styled-components";

const StyledRemoteDesktop = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  .controls {
    display: flex;
    gap: 4px;
    padding: 2px;
    background: rgba(0, 0, 0, 0.1);
  }

  .screen {
    flex: 1;
    background: #000;
  }
`;

export default StyledRemoteDesktop;
