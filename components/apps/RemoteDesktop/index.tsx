import { useRef } from "react";
import StyledRemoteDesktop from "components/apps/RemoteDesktop/StyledRemoteDesktop";
import useRemoteDesktop from "components/apps/RemoteDesktop/useRemoteDesktop";
import { type ComponentProcessProps } from "components/system/Apps/RenderComponent";
import Button from "styles/common/Button";

const RemoteDesktop: FC<ComponentProcessProps> = ({ id }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { containerRef, connect, disconnect } = useRemoteDesktop(id);

  return (
    <StyledRemoteDesktop ref={containerRef}>
      <div className="controls">
        <input ref={inputRef} placeholder="wss://host:port" />
        <Button onClick={() => connect(inputRef.current?.value || "")}>Connect</Button>
        <Button onClick={disconnect}>Disconnect</Button>
      </div>
      <div className="screen" />
    </StyledRemoteDesktop>
  );
};

export default RemoteDesktop;
