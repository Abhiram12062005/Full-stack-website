import React from 'react';
import './Features.css'
import tag from '../../assets/tag.png'
import reliability from '../../assets/reliability.png'
import sketch from '../../assets/sketch.png'
import maintanace from '../../assets/maintanace.png'
import made from '../../assets/made.png'
import plugin from '../../assets/plugin.png'

const Features = () => {
  // Duplicate the features data to create a seamless scroll effect
  const featuresData = [
    {
      icon: tag,
      title: "20% cheaper than market price",
      description: "Utmost offers our premium products at 20% lower than the standard market price. This means you can enjoy exceptional quality and durability while saving significantly on your project costs. By choosing Utmost, you're not only getting superior products but also maximizing your budget efficiency"
    },
    {
      icon: made,
      title: "Made In India",
      description: "Promoting the 'Make in India' initiative, our UPVC windows company offers high-quality, locally-manufactured windows, combining innovation and durability to enhance Indian homes with energy efficiency and modern design."
    },
    {
      icon: reliability,
      title: "30% more durable",
      description: "Indian weather can be tough—scorching heat, monsoons, and more. Our UPVC profiles are designed to handle it all. They won't rust, rot, or warp, so you get a product that's as durable as it is stylish."
    },
    {
      icon: sketch,
      title: "Custom designs for everyone",
      description: "Why settle for the ordinary when you can have the extraordinary? Utmost offers a wide range of colors and designs, perfect for any Indian home. Whether you prefer a modern look or something more traditional, we've got you covered. Make your home as unique as you are!"
    },
    {
      icon: maintanace,
      title: "Low Maintenance, High Satisfaction",
      description: "Who has time for constant maintenance? Our UPVC profiles require zero maintenance. Just a quick wipe-down, and they're good as new. Spend less time worrying about maintenance and more time enjoying your beautiful home."
    },
    {
      icon: plugin,
      title: "Save on electricity bills",
      description: "Tired of your home feeling like a sauna in summer? Our UPVC profiles are your answer. They insulate your home, keeping it cooler and helping you save big on energy bills. Think of it as a long-term investment that pays for itself!"
    }
  ];

  return (
    <div className="features">
      <section className="features-heading">
        <h1>Why Choose Utmost UPVC Profiles?</h1>
      </section>
      <section className="features-scroll-container">
        <div className="features-scroll-content">
          {/* Original set of cards */}
          {featuresData.map((feature, index) => (
            <div key={`feature-${index}`} className="card-feature">
              <div className="card-feature-top">
                <img width={30} src={feature.icon} alt="" />
                <h3>{feature.title}</h3>
              </div>
              <p>{feature.description}</p>
            </div>
          ))}
          {/* Duplicated set of cards for seamless scrolling */}
          {featuresData.map((feature, index) => (
            <div key={`feature-duplicate-${index}`} className="card-feature">
              <div className="card-feature-top">
                <img width={30} src={feature.icon} alt="" />
                <h3>{feature.title}</h3>
              </div>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Features;