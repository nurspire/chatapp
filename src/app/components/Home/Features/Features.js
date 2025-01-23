import { Video, Shield, FileText } from 'lucide-react'
import './Features.css'

export default function Features() {
  const features = [
    {
      icon: <Video className="feature-icon" />,
      title: "Video messaging",
      description: "Record and share video messages easily for direct and meaningful communication.",
    },
    {
      icon: <Shield className="feature-icon" />,
      title: "Keep safe & private",
      description: "Advanced end-to-end encryption ensuring total privacy and security.",
    },
    {
      icon: <FileText className="feature-icon" />,
      title: "Quick File Sharing",
      description: "Share documents, photos, and videos instantly with quick file sharing.",
    },
  ]

  return (
    <section className="features">
      <h2 className="section-title">Features for a better experience</h2>
      <div className="feature-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon-wrapper">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

