import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  Clock,
  Zap,
  Target,
  CheckCircle,
  AlertCircle,
  Headphones,
  Video,
  Settings,
  User,
  ClipboardList,
  MonitorUp,
  Trash2,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface ConversationEntry {
  id: number;
  timestamp: string;
  question: string;
  answer: string;
}

const InterviewPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [interviewType, setInterviewType] = useState<string>("");
  const [showSetup, setShowSetup] = useState(false);

  // Preferences state
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferencesSaved, setPreferencesSaved] = useState(false);
  const [userName, setUserName] = useState("");
  const [meetingPurpose, setMeetingPurpose] = useState("");
  const [generalInfo, setGeneralInfo] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [prefError, setPrefError] = useState("");

  // Recording/AI state
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<
    ConversationEntry[]
  >([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Ready to start");

  // Media refs
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Keep general info in a ref for downstream usage
  const generalInfoRef = useRef<string>("");

  const OPENAI_API_KEY = (import.meta as any).env?.VITE_OPENAI_API_KEY as
    | string
    | undefined;

  useEffect(() => {
    if (!OPENAI_API_KEY) {
      setError(
        "OpenAI API key not configured. Set VITE_OPENAI_API_KEY in your .env"
      );
    }
  }, []);

  // Space key toggles recording (only when not in input fields)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't interfere with space key in input fields, textareas, or contenteditable elements
      const target = event.target as HTMLElement;
      const isInputField = target && (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.contentEditable === 'true' ||
        target.closest('input') ||
        target.closest('textarea')
      );
      
      if (event.code === "Space" && !isProcessing && !isInputField) {
        event.preventDefault();
        if (isRecording) {
          stopRecording();
        } else {
          startRecording();
        }
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isRecording, isProcessing]);

  if (!user) return null;

  const interviewTypes = [
    {
      id: "technical",
      name: "Technical Interview",
      description: "Coding challenges, system design, algorithms",
      icon: Target,
      color: "var(--primary-500)",
      bgColor: "var(--primary-50)",
    },
    {
      id: "behavioral",
      name: "Behavioral Interview",
      description: "STAR method, leadership, teamwork questions",
      icon: Zap,
      color: "var(--accent-500)",
      bgColor: "var(--accent-50)",
    },
    {
      id: "general",
      name: "General Interview",
      description: "Mixed questions, company culture, role fit",
      icon: CheckCircle,
      color: "var(--success-500)",
      bgColor: "var(--success-50)",
    },
  ];

  const handleStartInterview = () => {
    if (!canRecord) {
      setError("No minutes left. Please top up or upgrade your plan.");
      return;
    }
    if (!preferencesSaved) {
      setShowPreferences(true);
      return;
    }
    if (!interviewType) {
      setShowSetup(true);
      return;
    }
    // Navigate to dedicated session page with preferences
    navigate("/dashboard/interview/session", {
      state: {
        userName,
        meetingPurpose,
        generalInfo,
        interviewType,
        selectedLanguage,
      },
    });
  };

  const handleStopInterview = () => {
    setIsRecording(false);
    setIsPaused(false);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleSavePreferences = () => {
    if (!userName.trim() || !meetingPurpose.trim() || !generalInfo.trim()) {
      setPrefError("Please fill in all fields before continuing.");
      return;
    }
    setPrefError("");
    setPreferencesSaved(true);
    generalInfoRef.current = generalInfo;
    setShowPreferences(false);
    if (!interviewType) {
      setShowSetup(true);
    }
  };

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "it", name: "Italian", flag: "🇮🇹" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "de", name: "German", flag: "🇩🇪" },
    { code: "pt", name: "Portuguese", flag: "🇵🇹" },
    { code: "ru", name: "Russian", flag: "🇷🇺" },
    { code: "ja", name: "Japanese", flag: "🇯🇵" },
    { code: "ko", name: "Korean", flag: "🇰🇷" },
    { code: "zh", name: "Chinese", flag: "🇨🇳" },
    { code: "ar", name: "Arabic", flag: "🇸🇦" },
    { code: "hi", name: "Hindi", flag: "🇮🇳" },
  ];

  // Derive usage safely from subscription/usage to avoid NaN
  const rawMinutesLeft = Number(user.subscription.minutesLeft ?? 0);
  const isUnlimited =
    rawMinutesLeft === -1 || user.subscription.plan === "pro+";
  const minutesUsed = Math.max(0, Number(user.usage.totalMinutesUsed || 0));
  // Compute plan cap for display
  const minutesLimit = isUnlimited
    ? -1
    : user.subscription.plan === "free"
    ? 5
    : Math.max(0, Number(user.subscription.minutesLeft || 0)) + minutesUsed; // Pro dynamic cap
  const derivedMinutesLeft =
    minutesLimit === -1 ? -1 : Math.max(0, minutesLimit - minutesUsed);
  const canRecord = minutesLimit === -1 || derivedMinutesLeft > 0;
  const usagePercentage =
    minutesLimit === -1 || minutesLimit === 0
      ? 0
      : Math.min(100, Math.round((minutesUsed / minutesLimit) * 100));
  const minutesLeft = isUnlimited ? "∞" : derivedMinutesLeft;

  // --- Screen capture & recording logic ---
  const startScreenCapture = async () => {
    try {
      setError("");
      setStatus("Starting screen capture...");
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;

      // attach to preview
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.load();
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(() => {});
          };
          videoRef.current.oncanplay = () => {};
        }
      }, 100);

      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        throw new Error(
          "No audio detected. Enable 'Share audio' when selecting your screen."
        );
      }

      setStatus("Screen captured! Press SPACE to start/stop recording");
    } catch (err: any) {
      setError(`Failed to start screen capture: ${err.message}`);
      setStatus("Failed to start");
    }
  };

  const stopScreenCapture = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsRecording(false);
    setIsProcessing(false);
    setStatus("Screen capture stopped");
  };

  const startRecording = async () => {
    if (!streamRef.current) {
      setError("Please start screen capture first");
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

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        processAudio();
      };

      mediaRecorderRef.current.start(100);
      setIsRecording(true);
      setStatus("Recording... Press SPACE to stop");
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
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setStatus("Processing audio...");
    }
  };

  const processAudio = async () => {
    setIsProcessing(true);
    try {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: (audioChunksRef.current[0] as any)?.type || "audio/webm",
      });
      if (audioBlob.size === 0)
        throw new Error("No audio data recorded. Please try again.");

      const transcription = await transcribeAudio(audioBlob);
      const cleanTranscription = transcription.trim();
      const unwanted = [
        "sottotitoli creati dalla comunità amara",
        "sottotitoli creati dalla comunità",
        "community subtitles",
        "subtitles by",
        "created by",
        "amara.org",
        "youtube",
        "auto-generated",
        "automatic captions",
        "...",
      ];
      const isBad =
        !cleanTranscription ||
        cleanTranscription.length < 3 ||
        unwanted.some((p) => cleanTranscription.toLowerCase().includes(p));
      if (isBad) throw new Error("No meaningful audio detected");

      const infoToUse = generalInfoRef.current || generalInfo;
      const response = await generateResponse(cleanTranscription, infoToUse);

      const entry: ConversationEntry = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        question: cleanTranscription,
        answer: response,
      };
      setConversationHistory((prev) => [...prev, entry]);
      setStatus("Complete! Press SPACE to record again");
    } catch (err: any) {
      if (err.message?.includes("No meaningful audio")) {
        setError(
          "No meaningful audio detected. Please ensure clear speech and try again."
        );
      } else if (err.message?.includes("No personal information")) {
        setError(
          "Personal information not found. Open preferences and save details."
        );
      } else if (err.message?.includes("No audio data")) {
        setError("No audio data captured. Check your screen capture settings.");
      } else {
        setError(`Processing failed: ${err.message}`);
      }
      setStatus("Processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");
    formData.append("model", "whisper-1");
    // Optionally set a language: formData.append("language", "it");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/ai/transcribe`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Whisper API error: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }
    const data = await response.json();
    return data.text as string;
  };

  const generateResponse = async (
    question: string,
    info: string
  ): Promise<string> => {
    const personalContext = (info || "").trim();

    // Create a more human-like, conversational prompt
    const prompt = `You are a real person in a job interview. Answer the interviewer's question naturally and conversationally, like a human would. 

${personalContext ? `Some context about me: ${personalContext}\n` : ""}

The interviewer just asked: "${question}"

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

Answer:`;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.8,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `GPT API error: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }
    const data = await response.json();
    return data.choices[0].message.content.trim();
  };

  const clearHistory = () => setConversationHistory([]);

  // --- UI ---
  return (
    <div className="interview-page">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="interview-header"
      >
        <div className="header-content">
          <h1 className="page-title">AI Interview Assistant</h1>
          <p className="page-subtitle">
            Get real-time AI assistance during your interview
          </p>
        </div>

        <div className="usage-info">
          <div className="usage-card">
            <Clock size={20} />
            <div className="usage-details">
              <span className="usage-label">Minutes Left</span>
              <span className="usage-value">{minutesLeft}</span>
            </div>
          </div>
          {minutesLimit !== -1 && (
            <div className="usage-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${usagePercentage}%`,
                    backgroundColor:
                      usagePercentage > 80
                        ? "var(--accent-500)"
                        : "var(--primary-500)",
                  }}
                />
              </div>
              <span className="progress-text">{usagePercentage}% used</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Preferences Modal */}
      {showPreferences && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="preferences-modal"
        >
          <div className="preferences-card">
            <div className="preferences-header">
              <div className="header-left">
                <div className="modal-icon">
                  <ClipboardList size={20} />
                </div>
                <h3>Interview Preferences</h3>
              </div>
              <button
                className="close-btn"
                onClick={() => setShowPreferences(false)}
              >
                ×
              </button>
            </div>
            <div className="preferences-body">
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Purpose of this meeting</label>
                <input
                  type="text"
                  placeholder="e.g., Mock interview for frontend position"
                  value={meetingPurpose}
                  onChange={(e) => setMeetingPurpose(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Interview Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                <p className="form-help">
                  Select the language for the interview conversation.
                </p>
              </div>
              <div className="form-group">
                <label>General information (details)</label>
                <textarea
                  rows={8}
                  placeholder="Paste background: profile, JD, company notes, resume highlights, etc."
                  value={generalInfo}
                  onChange={(e) => setGeneralInfo(e.target.value)}
                />
                <p className="form-help">
                  These details help personalize responses.
                </p>
              </div>
              {prefError && <div className="message error">{prefError}</div>}
              <div className="modal-actions">
                <button
                  className="setup-btn"
                  onClick={() => setShowPreferences(false)}
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="start-btn"
                  onClick={handleSavePreferences}
                >
                  <Play size={18} />
                  <span>Save & Continue</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Interview Setup */}
      {showSetup && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="interview-setup"
        >
          <div className="setup-header">
            <h3>Choose Interview Type</h3>
            <button onClick={() => setShowSetup(false)} className="close-btn">
              ×
            </button>
          </div>
          <div className="interview-types">
            {interviewTypes.map((type) => {
              const Icon = type.icon;
              return (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setInterviewType(type.id);
                    setShowSetup(false);
                    if (preferencesSaved) setIsRecording(true);
                  }}
                  className={`interview-type-card ${
                    interviewType === type.id ? "selected" : ""
                  }`}
                >
                  <div
                    className="type-icon"
                    style={{ backgroundColor: type.bgColor, color: type.color }}
                  >
                    <Icon size={24} />
                  </div>
                  <div className="type-content">
                    <h4>{type.name}</h4>
                    <p>{type.description}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Main Interview Interface */}
      <div className="interview-interface">
        {
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="pre-interview"
          >
            <div className="interview-card">
              <div className="card-header">
                <div className="mic-icon">
                  <Mic size={48} />
                </div>
                <h2>Ready to Start?</h2>
                <p>Set your preferences and choose your interview type</p>
              </div>
              {preferencesSaved && (
                <div className="selected-type" style={{ marginBottom: "1rem" }}>
                  <div className="type-badge">
                    Preferences saved for {userName || "Candidate"}
                  </div>
                </div>
              )}
              {interviewType && (
                <div className="selected-type">
                  <div className="type-badge">
                    {interviewTypes.find((t) => t.id === interviewType)?.name}
                  </div>
                </div>
              )}
              <div className="interview-controls">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartInterview}
                  className={`start-btn ${!canRecord ? "disabled" : ""}`}
                  disabled={!canRecord}
                >
                  <Play size={24} />
                  <span>
                    {canRecord ? "Start Interview" : "No minutes left"}
                  </span>
                </motion.button>
                <button
                  onClick={() => setShowPreferences(true)}
                  className="setup-btn"
                >
                  <User size={20} />
                  <span>Set Preferences</span>
                </button>
                <button
                  onClick={() => setShowSetup(true)}
                  className="setup-btn"
                >
                  <Settings size={20} />
                  <span>Choose Type</span>
                </button>
              </div>
              <div className="interview-features">
                <div className="feature-item">
                  <Headphones size={20} />
                  <span>Real-time AI assistance</span>
                </div>
                <div className="feature-item">
                  <Video size={20} />
                  <span>Audio transcription</span>
                </div>
                <div className="feature-item">
                  <Target size={20} />
                  <span>Personalized responses</span>
                </div>
              </div>
            </div>
          </motion.div>
        }
      </div>

      {/* Usage Warning */}
      {usagePercentage > 90 && user.usage.minutesLimit !== -1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="usage-warning"
        >
          <AlertCircle size={20} />
          <div className="warning-content">
            <h4>Low Minutes Warning</h4>
            <p>
              You're running low on minutes. Consider upgrading your plan for
              unlimited access.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default InterviewPage;
