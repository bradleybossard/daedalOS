import { useCallback, useEffect, useRef } from "react";
import { useProcesses } from "contexts/process";
import type RFB from "@novnc/novnc/core/rfb";

const REMOTE_LIB =
  "https://cdn.jsdelivr.net/npm/@novnc/novnc@1.4.0/core/rfb.js";

type UseRemoteDesktopReturn = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  connect: (url: string) => Promise<void>;
  disconnect: () => void;
};

const useRemoteDesktop = (id: string): UseRemoteDesktopReturn => {
  const { argument } = useProcesses();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rfbRef = useRef<RFB>();

  const connect = useCallback(
    async (url: string): Promise<void> => {
      if (containerRef.current && url) {
        const { default: RFB } = (await import(
          /* webpackIgnore: true */ REMOTE_LIB
        )) as { default: typeof RFB };

        const screen = containerRef.current.querySelector(
          ".screen"
        ) as HTMLElement;
        rfbRef.current = new RFB(screen, url);
        argument(id, "connected", true);
      }
    },
    [argument, id]
  );

  const disconnect = useCallback(() => {
    rfbRef.current?.disconnect();
    rfbRef.current = undefined;
    argument(id, "connected", false);
  }, [argument, id]);

  useEffect(() => {
    argument(id, "connect", connect);
    argument(id, "disconnect", disconnect);

    return disconnect;
  }, [argument, connect, disconnect, id]);

  return { containerRef, connect, disconnect };
};

export default useRemoteDesktop;
