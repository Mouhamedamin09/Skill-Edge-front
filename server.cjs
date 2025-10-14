const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Debug static file serving
app.use((req, res, next) => {
  if (
    req.url.includes(".png") ||
    req.url.includes(".jpg") ||
    req.url.includes(".jpeg") ||
    req.url.includes(".gif")
  ) {
    console.log(`📸 Static file request: ${req.url}`);
  }
  next();
});

// Serve static files from the dist directory with proper MIME types
app.use(
  express.static(path.join(__dirname, "dist"), {
    setHeaders: (res, path) => {
      if (path.endsWith(".png")) {
        res.setHeader("Content-Type", "image/png");
        res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache for 1 year
      } else if (path.endsWith(".jpg") || path.endsWith(".jpeg")) {
        res.setHeader("Content-Type", "image/jpeg");
        res.setHeader("Cache-Control", "public, max-age=31536000");
      } else if (path.endsWith(".gif")) {
        res.setHeader("Content-Type", "image/gif");
        res.setHeader("Cache-Control", "public, max-age=31536000");
      }
    },
  })
);

// Specific route for logo files to ensure they're served correctly
app.get("/skillEdgeLogo.png", (req, res) => {
  console.log("🎯 Logo request received:", req.url);
  const logoPath = path.join(__dirname, "dist", "skillEdgeLogo.png");
  console.log("📁 Logo path:", logoPath);

  // Set proper headers
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "public, max-age=31536000");

  res.sendFile(logoPath, (err) => {
    if (err) {
      console.error("❌ Error serving logo:", err);
      res.status(404).send("Logo not found");
    } else {
      console.log("✅ Logo served successfully");
    }
  });
});

app.get("/skilledge-tab-logo.png", (req, res) => {
  console.log("🎯 Tab logo request received:", req.url);
  const logoPath = path.join(__dirname, "dist", "skilledge-tab-logo.png");
  console.log("📁 Tab logo path:", logoPath);

  // Set proper headers
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "public, max-age=31536000");

  res.sendFile(logoPath, (err) => {
    if (err) {
      console.error("❌ Error serving tab logo:", err);
      res.status(404).send("Tab logo not found");
    } else {
      console.log("✅ Tab logo served successfully");
    }
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  console.log("Health check requested");
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    port: PORT,
  });
});

// Debug endpoint to list files in dist directory
app.get("/debug/files", (req, res) => {
  const fs = require('fs');
  const path = require('path');
  
  try {
    const distPath = path.join(__dirname, "dist");
    const files = fs.readdirSync(distPath);
    const fileStats = files.map(file => {
      const filePath = path.join(distPath, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        isDirectory: stats.isDirectory(),
        modified: stats.mtime
      };
    });
    
    res.json({
      distPath: distPath,
      files: fileStats,
      logoFiles: files.filter(f => f.includes('logo') || f.includes('Logo'))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Handle client-side routing - serve index.html for all routes
app.get("*", (req, res) => {
  console.log(`Serving index.html for route: ${req.url}`);
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Error handling
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Serving files from: ${path.join(__dirname, "dist")}`);
  console.log(`🏥 Health check available at: http://0.0.0.0:${PORT}/health`);
  console.log(`🌐 Server accessible from: http://localhost:${PORT}`);
});
