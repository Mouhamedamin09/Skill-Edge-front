import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import {
  MonitorUp,
  MicOff,
  Play,
  Pause,
  Square,
  Trash2,
  ArrowLeft,
  Zap,
} from "lucide-react";

interface ConversationEntry {
  id: number;
  timestamp: string;
  question: string;
  answer: string;
}

const InterviewSession: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as any;
  const {
    userName,
    meetingPurpose,
    generalInfo,
    interviewType,
    selectedLanguage,
  } = state || {};
  const { user, setUser } = useAuth();

  // Debug logging
  console.log("InterviewSession - Received state:", state);
  console.log("InterviewSession - userName:", userName);
  console.log("InterviewSession - userName type:", typeof userName);
  console.log("InterviewSession - userName length:", userName?.length);
  console.log("InterviewSession - user:", user);
  console.log("InterviewSession - user.subscription:", user?.subscription);

  const [status, setStatus] = useState("Ready to start");
  const [error, setError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<
    ConversationEntry[]
  >([]);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  // Time tracking state
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [sessionMinutesUsed, setSessionMinutesUsed] = useState(0);
  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [canRecord, setCanRecord] = useState(true);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(
    null
  );

  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stopTimerRef = useRef<number | null>(null);
  const timeTrackerRef = useRef<number | null>(null);

  // Initialize time tracking
  useEffect(() => {
    if (!state) navigate("/dashboard/interview");

    // Calculate initial remaining minutes
    const rawMinutesLeft = Number(user?.subscription?.minutesLeft ?? 0);
    const isUnlimited =
      rawMinutesLeft === -1 || user?.subscription?.plan === "pro+";
    const minutesUsed = Math.max(0, Number(user?.usage?.totalMinutesUsed || 0));
    
    let derivedMinutesLeft;
    if (isUnlimited) {
      derivedMinutesLeft = -1;
    } else if (user?.subscription?.plan === "free") {
      // For free plan, remaining minutes = 5 - used minutes
      derivedMinutesLeft = Math.max(0, 5 - minutesUsed);
    } else {
      // For pro plan, remaining minutes = rawMinutesLeft
      derivedMinutesLeft = Math.max(0, rawMinutesLeft);
    }

    console.log(
      "Initial calculation - rawMinutesLeft:",
      rawMinutesLeft,
      "minutesUsed:",
      minutesUsed,
      "plan:",
      user?.subscription?.plan,
      "derivedMinutesLeft:",
      derivedMinutesLeft
    );
    setRemainingMinutes(derivedMinutesLeft);
    setCanRecord(isUnlimited || derivedMinutesLeft > 0);
  }, [user, state, navigate]);

  // Update user minutes on server
  const updateUserMinutes = async (minutesUsed: number) => {
    try {
      console.log(`Updating user minutes: ${minutesUsed} minutes used`);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/update-usage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ minutesUsed }),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        console.log("User minutes updated successfully:", updatedUser);
        setUser(updatedUser);
      } else {
        console.error("Failed to update user minutes:", response.status);
      }
    } catch (error) {
      console.error("Failed to update user minutes:", error);
    }
  };

  // Time tracking effect - only track when recording
  useEffect(() => {
    if (isRecording && sessionStartTime && !isUnlimited()) {
      timeTrackerRef.current = window.setInterval(() => {
        const now = Date.now();
        const elapsedMinutes = Math.floor(
          (now - sessionStartTime) / (1000 * 60)
        );
        const newSessionMinutes = Math.max(0, elapsedMinutes);

        setSessionMinutesUsed(newSessionMinutes);

        console.log("Time tracking - sessionMinutesUsed:", newSessionMinutes);
      }, 1000); // Update every second
    }

    return () => {
      if (timeTrackerRef.current) {
        clearInterval(timeTrackerRef.current);
      }
    };
  }, [isRecording, sessionStartTime, user]);

  // Check if recording should be stopped due to time limit
  useEffect(() => {
    if (isRecording && !isUnlimited() && remainingMinutes <= 0) {
      console.log("Time is up! Stopping recording - remainingMinutes:", remainingMinutes);
      stopRecording();
      setError(
        "Time is up! No minutes left. Please upgrade your plan to continue."
      );
    }
  }, [isRecording, remainingMinutes]);

  const isUnlimited = () => {
    const rawMinutesLeft = Number(user?.subscription?.minutesLeft ?? 0);
    return rawMinutesLeft === -1 || user?.subscription?.plan === "pro+";
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isProcessing) {
        e.preventDefault();
        if (isRecording) stopRecording();
        else startRecording();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isRecording, isProcessing]);

  // Warn on page unload when recording
  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (isRecording) {
        e.preventDefault();
        e.returnValue = "Recording in progress";
        return "";
      }
      return undefined;
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [isRecording]);

  // Cleanup effect - update minutes when component unmounts
  useEffect(() => {
    return () => {
      // Update minutes when component unmounts (user navigates away)
      if (sessionStartTime && sessionMinutesUsed > 0) {
        updateUserMinutes(sessionMinutesUsed);
      }
    };
  }, [sessionStartTime, sessionMinutesUsed]);

  const startScreenCapture = async () => {
    try {
      setError("");
      setStatus("Starting screen capture...");
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;

      // Start time tracking
      setSessionStartTime(Date.now());
      setSessionMinutesUsed(0);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.load();
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(() => {});
          };
        }
      }, 100);
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0)
        throw new Error("No audio detected. Enable 'Share audio'.");
      setStatus("Screen captured! Press SPACE to start/stop recording");
    } catch (err: any) {
      setError(`Failed to start screen capture: ${err.message}`);
      setStatus("Failed to start");
    }
  };

  const stopScreenCapture = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsRecording(false);
    setIsProcessing(false);

    // Stop time tracking
    if (timeTrackerRef.current) {
      clearInterval(timeTrackerRef.current);
      timeTrackerRef.current = null;
    }

    // Update user minutes with final session time
    if (sessionStartTime && sessionMinutesUsed > 0) {
      console.log(
        `Stopping screen capture - updating ${sessionMinutesUsed} minutes`
      );
      updateUserMinutes(sessionMinutesUsed);
    } else {
      console.log("No session time to update:", {
        sessionStartTime,
        sessionMinutesUsed,
      });
    }

    // Clear time tracking state
    setSessionStartTime(null);
    setSessionMinutesUsed(0);

    setStatus("Screen capture stopped");
  };

  const startRecording = () => {
    if (!streamRef.current) {
      setError("Please start screen capture first");
      return;
    }

    // Check if recording is allowed based on remaining time
    if (!canRecord) {
      setError(
        "No minutes left. Please upgrade your plan to continue recording."
      );
      return;
    }
    try {
      setError("");
      setIsProcessing(false);
      const audioTracks = streamRef.current.getAudioTracks();
      const audioOnlyStream = new MediaStream(audioTracks);
      const mimeType = (MediaRecorder as any).isTypeSupported?.(
        "audio/webm;codecs=opus"
      )
        ? "audio/webm;codecs=opus"
        : (MediaRecorder as any).isTypeSupported?.("audio/webm")
        ? "audio/webm"
        : "audio/mp4";
      mediaRecorderRef.current = new MediaRecorder(audioOnlyStream, {
        mimeType,
      });
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => processAudio();
      mediaRecorderRef.current.start(100);
      setIsRecording(true);
      setRecordingStartTime(Date.now());
      setStatus("Recording... Press SPACE to stop");
      // Auto-stop when remaining minutes elapse
      if (!isUnlimited()) {
        const remainingSeconds = Math.max(0, Math.floor(remainingMinutes * 60));
        if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
        stopTimerRef.current = window.setTimeout(() => {
          stopRecording();
          setError("Time is out. No minutes left.");
        }, remainingSeconds * 1000);
      }
    } catch (err: any) {
      setError(`Recording failed: ${err.message}`);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      // Check minimum recording time (2 seconds)
      const recordingDuration = recordingStartTime
        ? Date.now() - recordingStartTime
        : 0;
      if (recordingDuration < 2000) {
        setError("Please record for at least 2 seconds before stopping.");
        return;
      }

      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingStartTime(null);
      setStatus("Processing audio...");
      if (stopTimerRef.current) {
        window.clearTimeout(stopTimerRef.current);
        stopTimerRef.current = null;
      }
    }
  };

  const processAudio = async () => {
    setIsProcessing(true);
    try {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: (audioChunksRef.current[0] as any)?.type || "audio/webm",
      });

      // Check if we have meaningful audio data (at least 1KB)
      if (audioBlob.size < 1024) {
        throw new Error(
          "Please speak for at least 2-3 seconds before stopping recording."
        );
      }

      // Estimate and clamp consumption before processing
      let approxSeconds = Math.max(1, Math.round(audioBlob.size / 4096));
      const currentLeft = Number(user?.subscription?.minutesLeft ?? 0);
      const isUnlimitedNow =
        currentLeft === -1 || user?.subscription?.plan === "pro+";
      if (!isUnlimitedNow) {
        const remainingSeconds = Math.max(0, Math.floor(currentLeft * 60));
        approxSeconds = Math.min(approxSeconds, remainingSeconds);
      }

      const transcription = await transcribeAudio(audioBlob);
      const text = (transcription || "").trim();
      if (!text || text.length < 3)
        throw new Error("No meaningful audio detected");
      // Streamed response for faster UX
      let streamed = "";
      const entry: ConversationEntry = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        question: text,
        answer: "",
      };
      setConversationHistory((p) => [...p, entry]);
      try {
        await generateResponseStream(
          text,
          generalInfo || "",
          userName || "",
          (chunk) => {
            streamed += chunk;
            setConversationHistory((prev) => {
              const copy = [...prev];
              const idx = copy.findIndex((e) => e.id === entry.id);
              if (idx !== -1) copy[idx] = { ...copy[idx], answer: streamed };
              return copy;
            });
          }
        );
      } catch {
        const answer = await generateResponse(
          text,
          generalInfo || "",
          userName || ""
        );
        setConversationHistory((prev) => {
          const copy = [...prev];
          const idx = copy.findIndex((e) => e.id === entry.id);
          if (idx !== -1) copy[idx] = { ...copy[idx], answer };
          return copy;
        });
      }
      setStatus("Complete! Press SPACE to record again");

      // Report consumption to backend and refresh user
      try {
        const API_BASE_URL =
          import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${API_BASE_URL}/usage/consume`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ seconds: approxSeconds }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.user) setUser(data.user);
          if (
            !data?.isUnlimited &&
            data?.user?.subscription?.minutesLeft === 0
          ) {
            setError("Time is out. No minutes left.");
          }
        }
      } catch {}
    } catch (err: any) {
      setError(err.message || "Processing failed");
      setStatus("Processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");
    formData.append("model", "whisper-1");
    // Set the language for transcription to match the selected language
    formData.append("language", selectedLanguage);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/ai/transcribe`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (!response.ok) throw new Error(`Whisper API error: ${response.status}`);
    const data = await response.json();
    return data.text as string;
  };

  const generateResponse = async (
    question: string,
    info: string,
    userName: string
  ): Promise<string> => {
    const personalContext = (info || "").trim();
    const languageName =
      selectedLanguage === "en"
        ? "English"
        : selectedLanguage === "it"
        ? "Italian"
        : selectedLanguage === "fr"
        ? "French"
        : selectedLanguage === "es"
        ? "Spanish"
        : selectedLanguage === "de"
        ? "German"
        : selectedLanguage === "pt"
        ? "Portuguese"
        : selectedLanguage === "ru"
        ? "Russian"
        : selectedLanguage === "ja"
        ? "Japanese"
        : selectedLanguage === "ko"
        ? "Korean"
        : selectedLanguage === "zh"
        ? "Chinese"
        : selectedLanguage === "ar"
        ? "Arabic"
        : selectedLanguage === "hi"
        ? "Hindi"
        : "English";

    console.log("generateResponse - userName:", userName);
    console.log("generateResponse - userName value:", JSON.stringify(userName));
    const finalUserName = userName || "the candidate";
    console.log("generateResponse - finalUserName:", finalUserName);
    const systemPrompt = `You are a real person in a job interview. Your name is ${finalUserName}. You MUST respond ONLY in ${languageName}. Answer the interviewer's question naturally and conversationally, like a human would.

CRITICAL: Respond ONLY in ${languageName}. If the interviewer asks in another language, still respond in ${languageName}.

${personalContext ? `Some context about me: ${personalContext}\n` : ""}

Instructions:
- Answer like a real human being, not an AI
- Use natural speech patterns, contractions, and casual language
- Be conversational and engaging
- If it's a technical question, explain it in simple terms
- If it's about math, science, or any other topic, answer it naturally
- If it's off-topic or personal, still answer it like a normal person would
- Use "I" statements and personal experiences when relevant
- Keep it conversational (2-4 sentences)
- Don't sound robotic or formal
- Show personality and confidence
- Answer ANY question the interviewer asks, no matter the topic`;

    // Build messages array with conversation history
    const messages: Array<{ role: string; content: string }> = [
      { role: "system", content: systemPrompt },
    ];

    // Add all previous conversation history
    conversationHistory.forEach((entry) => {
      messages.push({ role: "user", content: entry.question });
      if (entry.answer) {
        messages.push({ role: "assistant", content: entry.answer });
      }
    });

    // Add current question
    messages.push({ role: "user", content: question });

    const response = await fetch(`${import.meta.env.VITE_API_URL}/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 500,
        temperature: 0.8,
      }),
    });
    if (!response.ok) throw new Error(`GPT API error: ${response.status}`);
    const data = await response.json();
    return data.choices[0].message.content.trim();
  };

  // Streaming variant for lower latency
  const generateResponseStream = async (
    question: string,
    info: string,
    userName: string,
    onToken: (chunk: string) => void
  ): Promise<void> => {
    const personalContext = (info || "").trim();
    const languageName =
      selectedLanguage === "en"
        ? "English"
        : selectedLanguage === "it"
        ? "Italian"
        : selectedLanguage === "fr"
        ? "French"
        : selectedLanguage === "es"
        ? "Spanish"
        : selectedLanguage === "de"
        ? "German"
        : selectedLanguage === "pt"
        ? "Portuguese"
        : selectedLanguage === "ru"
        ? "Russian"
        : selectedLanguage === "ja"
        ? "Japanese"
        : selectedLanguage === "ko"
        ? "Korean"
        : selectedLanguage === "zh"
        ? "Chinese"
        : selectedLanguage === "ar"
        ? "Arabic"
        : selectedLanguage === "hi"
        ? "Hindi"
        : "English";

    console.log("generateResponseStream - userName:", userName);
    console.log(
      "generateResponseStream - userName value:",
      JSON.stringify(userName)
    );
    const finalUserName = userName || "the candidate";
    console.log("generateResponseStream - finalUserName:", finalUserName);
    const systemPrompt = `You are a real person in a job interview. Your name is ${finalUserName}. You MUST respond ONLY in ${languageName}. Answer the interviewer's question naturally and conversationally, like a human would.

CRITICAL: Respond ONLY in ${languageName}. If the interviewer asks in another language, still respond in ${languageName}.

${personalContext ? `Some context about me: ${personalContext}\n` : ""}

Instructions:
- Answer like a real human being, not an AI
- Use natural speech patterns, contractions, and casual language
- Be conversational and engaging
- If it's a technical question, explain it in simple terms
- If it's about math, science, or any other topic, answer it naturally
- If it's off-topic or personal, still answer it like a normal person would
- Use "I" statements and personal experiences when relevant
- Keep it conversational (2-4 sentences)
- Don't sound robotic or formal
- Show personality and confidence
- Answer ANY question the interviewer asks, no matter the topic`;

    // Build messages array with conversation history
    const messages: Array<{ role: string; content: string }> = [
      { role: "system", content: systemPrompt },
    ];

    // Add all previous conversation history
    conversationHistory.forEach((entry) => {
      messages.push({ role: "user", content: entry.question });
      if (entry.answer) {
        messages.push({ role: "assistant", content: entry.answer });
      }
    });

    // Add current question
    messages.push({ role: "user", content: question });

    const res = await fetch(`${import.meta.env.VITE_API_URL}/ai/chat-stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 500,
        temperature: 0.8,
        stream: true,
      }),
    });
    if (!res.ok || !res.body) throw new Error(`GPT API error: ${res.status}`);
    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (!trimmed.startsWith("data:")) continue;
        const data = trimmed.slice(5).trim();
        if (data === "[DONE]") continue;
        try {
          const json = JSON.parse(data);
          const delta = json.choices?.[0]?.delta?.content;
          if (delta) onToken(delta);
        } catch {}
      }
    }
  };

  return (
    <div className="interview-page">
      <div className="interview-header">
        <div className="header-left">
          <button className="setup-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          <h1 className="page-title">Interview Session</h1>
        </div>
        <div className="header-right">
          <div className="time-display">
            <div className="time-info">
              <span className="time-label">Session Time:</span>
              <span className="time-value">{sessionMinutesUsed} min</span>
            </div>
            <div className="time-info">
              <span className="time-label">Remaining:</span>
              <span
                className={`time-value ${
                  remainingMinutes <= 1 ? "warning" : ""
                }`}
              >
                {isUnlimited() ? "∞" : remainingMinutes} min
              </span>
            </div>
          </div>
          <div className="plan-badge">
            {interviewType?.toUpperCase?.() || "INTERVIEW"}
          </div>
        </div>
      </div>

      {showLeaveConfirm && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <div className="modal-header">Leave Recording?</div>
            <div className="modal-body">
              You are currently recording. Are you sure you want to stop and
              exit this page?
            </div>
            <div className="modal-actions">
              <button
                className="setup-btn"
                onClick={() => setShowLeaveConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="plan-btn danger"
                onClick={() => {
                  stopRecording();
                  navigate(-1);
                }}
              >
                Stop & Exit
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="page-content">
        <div className="session-grid">
          <div className="session-left">
            <div className="panel-header between">
              <div className="left-controls">
                <span className="toggle on"></span>
                <span className="tab active">Transcript</span>
                <span className="tab">Mute</span>
                <span className="tab">Docs</span>
              </div>
              <div className="right-title">Answer</div>
            </div>
            <div className="panel-body scroll">
              {conversationHistory.length === 0 ? (
                <div className="placeholder">
                  <p>
                    On the left side, the AI will analyze and give response to
                    your target's questions.
                  </p>
                  <p>
                    Make sure to start screen capture and press SPACE to record
                    your audio.
                  </p>
                </div>
              ) : (
                conversationHistory
                  .slice()
                  .reverse()
                  .map((entry, idx) => (
                    <div key={entry.id} className="conversation-item">
                      <div className="conversation-meta">
                        #{conversationHistory.length - idx} · {entry.timestamp}
                      </div>
                      <div className="q">{entry.question}</div>
                      <div className="a">{entry.answer}</div>
                    </div>
                  ))
              )}
            </div>
          </div>

          <div className="session-right">
            <div className="panel top">
              <div className="panel-header between">
                <div className="left-controls">
                  <span className="tab active">Screen</span>
                </div>
                <div className="right-title small">Step 1 ↑</div>
              </div>
              <div className="panel-body">
                {!streamRef.current ? (
                  <div className="center">
                    <button className="setup-btn" onClick={startScreenCapture}>
                      <MonitorUp size={16} /> <span>Start Screen Capture</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="control-row">
                      <div
                        className={`status-pill ${
                          isRecording ? "recording" : "ready"
                        }`}
                      >
                        <span className="dot"></span>
                        <span>
                          {isRecording
                            ? "Recording (SPACE to stop)"
                            : "Ready (SPACE to start)"}
                        </span>
                      </div>
                      {!streamRef.current ? (
                        <button
                          className="plan-btn primary"
                          onClick={startScreenCapture}
                          style={{ width: "auto" }}
                        >
                          Start Screen Capture
                        </button>
                      ) : (
                        <button
                          className="plan-btn danger"
                          onClick={stopScreenCapture}
                          style={{ width: "auto" }}
                        >
                          Stop Screen Capture
                        </button>
                      )}
                    </div>
                    <div
                      className={`status-banner ${
                        isProcessing
                          ? "processing"
                          : isRecording
                          ? "recording"
                          : "ready"
                      }`}
                    >
                      Status: {status}
                    </div>
                    {error && <div className="message error">{error}</div>}
                    <div className="video-wrap">
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        controls={false}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="panel bottom">
              <div className="panel-header between">
                <div className="left-controls">
                  <span className="toggle on"></span>
                  <span>Your Transcript</span>
                </div>
                <div className="right-title small danger">Mic Off</div>
              </div>
              <div className="panel-body center small">
                Your transcript will show up here.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
