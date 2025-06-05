import { useCallback, useRef, useState } from "react";

const useSpeechToText = (
  onResult: (text: string) => void
): {
  recording: boolean;
  start: () => void;
  stop: () => void;
} => {
  const [recording, setRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const speechRef = useRef<SpeechRecognition | null>(null);

  const start = useCallback(async () => {
    if (recording) return;
    setRecording(true);

    try {
      const { createWhisper } = await import("whisper-wasm");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks: Blob[] = [];
      recorderRef.current = new MediaRecorder(stream);
      recorderRef.current.ondataavailable = (e) => chunks.push(e.data);
      recorderRef.current.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const buffer = await blob.arrayBuffer();
        const whisper = await createWhisper();
        const text = await whisper.transcribe(buffer);
        onResult(text);
        stream.getTracks().forEach((track) => track.stop());
        setRecording(false);
      };
      recorderRef.current.start();
    } catch {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        speechRef.current = new SpeechRecognition();
        speechRef.current.continuous = false;
        speechRef.current.onresult = (e: SpeechRecognitionEvent) => {
          const { transcript } = e.results[0][0];
          onResult(transcript);
        };
        speechRef.current.onend = () => setRecording(false);
        speechRef.current.start();
      } else {
        setRecording(false);
      }
    }
  }, [onResult, recording]);

  const stop = useCallback(() => {
    if (!recording) return;
    if (recorderRef.current) {
      recorderRef.current.stop();
    } else if (speechRef.current) {
      speechRef.current.stop();
    }
  }, [recording]);

  return { recording, start, stop };
};

export default useSpeechToText;
