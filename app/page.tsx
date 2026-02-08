'use client';

import React, { useState, useRef } from "react";
import Image from "next/image";
import Scene from "./components/Scene";

export default function Home() {
  const [showLogo, setShowLogo] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(1.0);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleDownload = async () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    // Start recording
    const stream = canvas.captureStream(60); // Capture at 60 FPS
    const recorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9'
    });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `it-keychain-animation-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      chunksRef.current = [];
      setRecordingTime(0);
    };

    chunksRef.current = [];
    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);

    // Auto-stop after 10 seconds or manual stop
    let time = 0;
    const interval = setInterval(() => {
      time += 1;
      setRecordingTime(time);
      if (time >= 10) {
        clearInterval(interval);
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      }
    }, 1000);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black font-sans text-white">
      {/* Top Center Logo - Behind the 3D model */}
      {showLogo && (
        <div className="absolute top-[2vh] left-1/2 -translate-x-1/2 z-[5] opacity-100 pointer-events-none transition-opacity duration-500">
          <Image
            src="/world of it white.png"
            alt="World of IT Logo"
            width={2000}
            height={1000}
            className="w-[85vw] md:w-[70vw] h-auto max-h-[40vh] object-contain"
            priority
          />
        </div>
      )}

      {/* 3D Scene - Higher z-index but transparent background */}
      <div className="relative z-10 w-full h-full">
        <Scene rotationSpeed={rotationSpeed} transparentMode={isRecording} />
      </div>

      {/* Final Polish Controls */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-6 w-full max-w-2xl px-4">
        <div className="flex flex-wrap justify-center gap-4 p-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl">
          {/* Logo Toggle */}
          <button
            onClick={() => setShowLogo(!showLogo)}
            className={`px-6 py-2 rounded-2xl text-sm font-semibold transition-all duration-300 ${showLogo ? 'bg-white text-black shadow-lg shadow-white/10' : 'bg-transparent text-white hover:bg-white/10'
              }`}
          >
            {showLogo ? 'Logo: Visible' : 'Logo: Hidden'}
          </button>

          {/* Speed Controls */}
          <div className="flex items-center gap-1 bg-black/20 p-1 rounded-2xl border border-white/5">
            {[0.5, 1, 2, 5].map((speed) => (
              <button
                key={speed}
                onClick={() => setRotationSpeed(speed)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${rotationSpeed === speed ? 'bg-white text-black' : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Download Component */}
          <button
            onClick={handleDownload}
            className={`px-6 py-2 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-white text-black hover:bg-gray-200'
              }`}
          >
            {isRecording ? `Recording (${recordingTime}s)` : 'Capture Scene'}
            {!isRecording && (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
              </svg>
            )}
          </button>
        </div>

        {isRecording && (
          <div className="flex items-center gap-2 px-4 py-1 bg-red-600/10 border border-red-600/20 rounded-full">
            <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
            <p className="text-red-400 text-[10px] tracking-[0.2em] font-bold uppercase">Exporting Studio Quality Render</p>
          </div>
        )}
      </div>
    </main>
  );
}
