import React from "react";

const features = [
  {
    title: "2D 지도",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    icon: "🗺️",
    description: "Interactive Maps",
    path: "/map",
    isAvailable: true,
  },
  {
    title: "3D 가시화",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    icon: "🎨",
    description: "3D Visualization",
    path: "/3d",
    isAvailable: false,
    status: "Coming Soon",
  },
  {
    title: "Lab",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    icon: "🧪",
    description: "Research & Development",
    path: "/lab",
    isAvailable: false,
    status: "Coming Soon",
  },
  {
    title: "OpenAPI",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    icon: "🔌",
    description: "API Integration",
    path: "/openapi",
    isAvailable: false,
    status: "Coming Soon",
  },
];

function App() {
  const handleCardClick = (feature) => {
    if (feature.isAvailable) {
      console.log(`${feature.title} 페이지로 이동: ${feature.path}`);
      window.location.href = feature.path;
    } else {
      alert(
        `${feature.title}은(는) ${feature.status}입니다.\n\n곧 만나보실 수 있습니다!`
      );
    }
  };

  return (
    <div style={outerStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            <span style={titleGradient}>SJ-LAB</span>
          </h1>
          <p style={subtitleStyle}>Creative Developer & Designer</p>
        </div>
        <div style={gridStyle}>
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              style={{
                ...cardStyle,
                ...(feature.isAvailable ? {} : disabledCardStyle),
              }}
              onClick={() => handleCardClick(feature)}
            >
              <div
                style={{ ...iconContainerStyle, background: feature.gradient }}
              >
                <span style={iconStyle}>{feature.icon}</span>
              </div>
              <h3 style={labelStyle}>{feature.title}</h3>
              <p style={descriptionStyle}>{feature.description}</p>
              {!feature.isAvailable && (
                <div style={overlayStyle}>
                  <div style={overlayContentStyle}>
                    <span style={overlayTextStyle}>{feature.status}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const outerStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)",
  overflow: "hidden",
};

const containerStyle = {
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(30px)",
  borderRadius: "2.5rem",
  boxShadow: "0 25px 50px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
  padding: "3rem 4rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  border: "1px solid rgba(255,255,255,0.1)",
  maxHeight: "85vh",
  maxWidth: "85vw",
  position: "relative",
  overflow: "hidden",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "3rem",
};

const titleStyle = {
  fontWeight: 200,
  fontSize: "3.5rem",
  marginBottom: "1rem",
  letterSpacing: "0.25em",
  color: "#ffffff",
  textShadow: "0 2px 10px rgba(0,0,0,0.1)",
  fontFamily: "'Poppins', 'Helvetica Neue', Arial, sans-serif",
  lineHeight: 1.2,
};

const titleGradient = {
  background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const subtitleStyle = {
  fontSize: "1rem",
  fontWeight: 300,
  color: "rgba(255, 255, 255, 0.7)",
  letterSpacing: "0.15em",
  fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  margin: 0,
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "2.5rem 3rem",
  width: "100%",
};

const cardStyle = {
  background: "rgba(255, 255, 255, 0.08)",
  borderRadius: "1.5rem",
  boxShadow:
    "0 15px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
  padding: "2.5rem 2rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  minWidth: "160px",
  minHeight: "200px",
  border: "1px solid rgba(255,255,255,0.1)",
  position: "relative",
  overflow: "hidden",
};

const disabledCardStyle = {
  filter: "blur(0.3px)",
  opacity: 0.9,
  cursor: "not-allowed",
};

const iconContainerStyle = {
  width: "70px",
  height: "70px",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "1.5rem",
  boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
  transition: "all 0.4s ease",
  position: "relative",
};

const iconStyle = {
  fontSize: "2.2rem",
  filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.2))",
};

const labelStyle = {
  fontSize: "1.1rem",
  fontWeight: 500,
  color: "#ffffff",
  letterSpacing: "0.08em",
  textAlign: "center",
  textShadow: "0 2px 8px rgba(0,0,0,0.15)",
  fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  margin: "0 0 0.6rem 0",
  lineHeight: 1.3,
};

const descriptionStyle = {
  fontSize: "0.85rem",
  fontWeight: 300,
  color: "rgba(255, 255, 255, 0.6)",
  letterSpacing: "0.08em",
  textAlign: "center",
  fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  margin: 0,
  lineHeight: 1.4,
};

const overlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "rgba(0, 0, 0, 0.25)",
  borderRadius: "1.5rem",
  backdropFilter: "blur(0.5px)",
};

const overlayContentStyle = {
  background: "rgba(255, 255, 255, 0.95)",
  padding: "1rem 2rem",
  borderRadius: "2rem",
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  border: "2px solid rgba(255, 255, 255, 0.8)",
};

const overlayTextStyle = {
  fontSize: "1rem",
  fontWeight: 600,
  color: "#1e293b",
  letterSpacing: "0.1em",
  fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  textTransform: "uppercase",
};

export default App;
