import Image from 'next/image'
import './Testimonials.css'

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Manager",
      content: "Echo has revolutionized our customer communication. It's intuitive and efficient!",
      avatar: "/moaz.png?height=80&width=80",
    },
    {
      name: "Michael Chen",
      role: "Small Business Owner",
      content: "The video messaging feature has helped us maintain a personal touch with our clients.",
      avatar: "/uneeb.png?height=80&width=80",
    },
    {
      name: "Emily Rodriguez",
      role: "Customer Support Lead",
      content: "Our team's productivity has skyrocketed since we started using Echo. Highly recommended!",
      avatar: "/fahad.png?height=80&width=80",
    },
  ]

  return (
    <section className="testimonials">
      <h2 className="section-title">What our customers say</h2>
      <div className="testimonial-grid">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <div className="testimonial-content">
              <p>"{testimonial.content}"</p>
            </div>
            <div className="testimonial-author">
              <Image
                src={testimonial.avatar}
                alt={testimonial.name}
                width={80}
                height={80}
                className="testimonial-avatar"
              />
              <div className="testimonial-info">
                <h4 className="testimonial-name">{testimonial.name}</h4>
                <p className="testimonial-role">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

