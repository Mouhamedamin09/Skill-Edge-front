import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Shield,
  Zap,
  Eye,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const DesktopPage: React.FC = () => {
  const { user } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const isProUser =
    user?.subscription?.plan === "pro" || user?.subscription?.plan === "pro+";
  const downloadUrl =
    "https://skilledgespace.fra1.digitaloceanspaces.com/SkillEdge%20Desktop%20Setup%201.0.0.exe";

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Simulate download progress
      const interval = setInterval(() => {
        setDownloadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsDownloading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // Create download link
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "SkillEdge Desktop Setup 1.0.0.exe";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      setIsDownloading(false);
    }
  };

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Undetectable AI",
      description:
        "Advanced technology that prevents interviewers from detecting AI assistance",
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Screen Share Safe",
      description:
        "Works seamlessly during screen sharing without being detected",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Assistance",
      description: "Get instant AI-powered responses during live interviews",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SkillEdge Desktop
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The ultimate undetectable AI interview assistant. Download now and
            unlock your potential with Pro or Pro+ access.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Side - App Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* App Preview */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-6 flex items-center justify-center">
                <div className="text-center text-white">
                  <Shield className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold">SkillEdge Desktop</h3>
                  <p className="text-blue-100">Version 1.0.0</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Key Features
                </h3>
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="text-blue-600 mt-1">{feature.icon}</div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Requirements */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                System Requirements
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Windows 10 or later</li>
                <li>• 4GB RAM minimum</li>
                <li>• 100MB free disk space</li>
                <li>• Internet connection</li>
                <li>• Pro or Pro+ SkillEdge account</li>
              </ul>
            </div>
          </motion.div>

          {/* Right Side - Download & Access */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Download Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Download Now
                </h3>
                <p className="text-gray-600">
                  Free to download, Pro/Pro+ required to use
                </p>
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Downloading... {downloadProgress}%</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Download Desktop App</span>
                  </>
                )}
              </button>

              {/* Download Progress */}
              {isDownloading && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${downloadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  File size: ~15MB • Version 1.0.0
                </p>
              </div>
            </div>

            {/* Access Control */}
            <div
              className={`rounded-2xl p-6 shadow-lg ${
                isProUser
                  ? "bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200"
                  : "bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200"
              }`}
            >
              <div className="flex items-start space-x-3">
                {isProUser ? (
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                ) : (
                  <Lock className="w-6 h-6 text-amber-600 mt-1" />
                )}
                <div>
                  <h3
                    className={`text-lg font-semibold ${
                      isProUser ? "text-green-800" : "text-amber-800"
                    }`}
                  >
                    {isProUser ? "Access Granted" : "Pro/Pro+ Required"}
                  </h3>
                  <p
                    className={`text-sm mt-1 ${
                      isProUser ? "text-green-700" : "text-amber-700"
                    }`}
                  >
                    {isProUser
                      ? "You can use the desktop app with your current plan!"
                      : "Upgrade to Pro or Pro+ to unlock desktop app features."}
                  </p>
                </div>
              </div>

              {!isProUser && (
                <div className="mt-4">
                  <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 px-4 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200">
                    Upgrade to Pro
                  </button>
                </div>
              )}
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                How It Works
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <p className="text-sm text-gray-600">
                    Download and install the desktop app
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <p className="text-sm text-gray-600">
                    Sign in with your Pro/Pro+ account
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <p className="text-sm text-gray-600">
                    Start your interview with undetectable AI assistance
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200"
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Security & Privacy
              </h3>
              <p className="text-blue-800 text-sm">
                SkillEdge Desktop uses advanced encryption and privacy
                protection. Your interview data is never stored locally, and the
                AI assistance is completely undetectable by standard screen
                sharing tools. We prioritize your privacy and security.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DesktopPage;
