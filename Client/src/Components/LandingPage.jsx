import React from "react";
import styles from "../css/LandingPage.module.css"; // Ensure correct path
import SparkImg from "../assets/SparkImg.png";
import AnalyticsImg from "../assets/Analytics1.png";
import RevenueImg from "../assets/Revenue.png";
import BodyImage from "../assets/div.png"; // Ensure correct path to body image
import CustomerImage from "../assets/description.png"; // Assuming the image for testimonials 
import Image1 from "../assets/Image1.png";
import Image2 from "../assets/Image2.png";
import Image3 from "../assets/Image3.png";
import Image4 from "../assets/Image4.png";
import Image5 from "../assets/Image5.png";
import Image6 from "../assets/Image6.png";
import Image7 from "../assets/Image7.png";
import Image8 from "../assets/Image8.png";
import Image9 from "../assets/Image9.png"; // Ensure correct path to images
import { FaTwitter, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <img src={SparkImg} alt="Spark Logo" className={styles.logo} />
          <span className={styles.marketplaceText}>| Marketplace</span>
        </div>
        <button className={styles.signupButton}>
          <Link to="/signup" className={styles.link}>Sign up free</Link>
        </button>
      </header>

      <main className={styles.mainSection}>
        <div className={styles.textContent}>
          <h1 className={styles.mainHeading}>
            The easiest place to update and share your Connection
          </h1>
          <p className={styles.subheading}>
            Help your followers discover everything you’re sharing all over the internet, in one simple place.
            They’ll thank you for it!
          </p>
          <button className={styles.ctaButton}>Get your free Spark</button>
        </div>
        <div className={styles.analyticsSection}>
          <img src={AnalyticsImg} alt="Analytics" className={styles.analyticsImg} />
        </div>
      </main>

      {/* Revenue Section */}
      <section className={styles.revenueSection}>
        <div className={styles.revenueImageContainer}>
          <img src={RevenueImg} alt="Revenue" className={styles.revenueImg} />
        </div>
        <div className={styles.revenueDescription}>
          <h2>Analyze your audience and keep your followers engaged</h2>
          <p>
            Track your engagement over time, monitor revenue and learn what’s converting your audience.
            Make informed updates on the fly to keep them coming back.
          </p>
        </div>
      </section>

      {/* Body Content Section */}
      <section className={styles.bodyContent}>
        <div className={styles.bodyTextContainer}>
          <h2 className={styles.bodyHeading}>
            <strong>Share limitless content in limitless ways</strong>
          </h2>
          <p className={styles.bodyDescription}>
            Connect your content in all its forms and help followers find more of what they’re looking for.
            Your TikToks, Tweets, YouTube videos, music, articles, recipes, podcasts, and more...
            It all comes together in one powerful place.
          </p>
        </div>
        <div className={styles.bodyImageWrapper}>
          <img src={BodyImage} alt="Share your content" className={styles.bodyImage} />
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className={styles.testimonialContent}>
          <div className={styles.testimonialLeft}>
            <h2 className={styles.testimonialHeading}>
              Here’s what our <span className={styles.highlightText}>customer</span> <br/>has to say
            </h2>
          </div>
          <div className={styles.testimonialRight}>
            <img src={CustomerImage} alt="Customer Testimonial" className={styles.customerImage} />
          </div>
        </div>
        <button className={styles.customerStoriesButton}>Read customer stories</button>
        <div className={styles.testimonialGrid}>
          {/* Testimonial Card 1 */}
          <div className={`${styles.testimonialCard} ${styles.card1}`}>
            <h3>Amazing tool! Saved me months</h3>
            <p>
              This is a placeholder for your testimonials and what your client has to say, <br/>put them here and make sure it's 100% true and meaningful.
            </p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.authorDot}></div>
              <div className={styles.authorInfo}>
                <p><strong>John Master</strong></p>
                <p>Director, Spark.com</p>
              </div>
            </div>
          </div>
          {/* Testimonial Card 2 */}
          <div className={styles.testimonialCard}>
            <h3>Amazing tool! Saved me months</h3>
            <p>
              This is a placeholder for your testimonials and what your client has to say, <br/>put them here and make sure it's 100% true and meaningful.
            </p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.authorDot}></div>
              <div className={styles.authorInfo}>
                <p><strong>John Master</strong></p>
                <p>Director, Spark.com</p>
              </div>
            </div>
          </div>
          {/* Testimonial Card 3 */}
          <div className={styles.testimonialCard}>
            <h3>Amazing tool! Saved me months</h3>
            <p>
              This is a placeholder for your testimonials and what your client has to say, <br/>put them here and make sure it's 100% true and meaningful.
            </p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.authorDot}></div>
              <div className={styles.authorInfo}>
                <p><strong>John Master</strong></p>
                <p>Director, Spark.com</p>
              </div>
            </div>
          </div>
          {/* Testimonial Card 4 */}
          <div className={`${styles.testimonialCard} ${styles.card4}`}>
            <h3>Amazing tool! Saved me months</h3>
            <p>
              This is a placeholder for your testimonials and what your client has to say,<br/> put them here and make sure it's 100% true and meaningful.
            </p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.authorDot}></div>
              <div className={styles.authorInfo}>
                <p><strong>John Master</strong></p>
                <p>Director, Spark.com</p>
              </div>
            </div>
          </div>
        </div>
      </section> 

{/* Footer Section */}
<footer className={styles.footerSection}>
  <h1 className={styles.footerTitle}>APP Links and Integrations</h1>
  <div className={styles.footerGrid}>
    <div className={styles.footerItem}>
      <img src={Image1} alt="Image1" className={styles.footerImage} />
    </div>
    <div className={styles.footerItem}>
      <img src={Image2} alt="Image2" className={styles.footerImage} />
    </div>
    <div className={styles.footerItem}>
      <img src={Image3} alt="Image3" className={styles.footerImage} />
    </div>
    <div className={styles.footerItem}>
      <img src={Image4} alt="Image4" className={styles.footerImage} />
    </div>
    <div className={styles.footerItem}>
      <img src={Image5} alt="Image5" className={styles.footerImage} />
    </div>
    <div className={styles.footerItem}>
      <img src={Image6} alt="Image6" className={styles.footerImage} />
    </div>
    <div className={styles.footerItem}>
      <img src={Image7} alt="Image7" className={styles.footerImage} />
    </div>
    <div className={styles.footerItem}>
      <img src={Image8} alt="Image8" className={styles.footerImage} />
    </div>
    <div className={styles.footerItem}>
      <img src={Image9} alt="Image9" className={styles.footerImage} />
    </div> 
  </div>

  <div className={styles.footerdiv}>
    <div className={styles.authButtons}>
      <button className={styles.loginButton}>
        <Link to="/login" className={styles.link}>Log in</Link>
      </button>
      <button className={styles.signupButton}>
        <Link to="/signup" className={styles.link}>Sign up free</Link>
      </button>
    </div>

    <div className={styles.footerLinks}>
      <div className={styles.linkSection}>
        <h4>About Spark</h4>
        <ul>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Press</a></li>
          <li><a href="#">Social Good</a></li>
          <li><a href="#">Contact</a></li>
          <li><a href="#">Careers</a></li>
        </ul>
      </div>
      <div className={styles.linkSection}>
        <h4>Support</h4>
        <ul>
          <li><a href="#">Getting Started</a></li>
          <li><a href="#">Features and How-Tos</a></li>
          <li><a href="#">FAQs</a></li>
          <li><a href="#">Report a Violation</a></li>
        </ul>
      </div>
      <div className={styles.linkSection}>
        <h4>Legal</h4>
        <ul>
          <li><a href="#">Terms and Conditions</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Cookie Notice</a></li>
          <li><a href="#">Trust Center</a></li>
        </ul>
      </div>
    </div>
    <div className={styles.Ackndiv}>
    <div className={styles.footerAcknowledgment}>
      <p>
        We acknowledge the Traditional Custodians of the land on which our office stands, The Wurundjeri<br/> people of the Kulin Nation, and pay our respects to Elders past, present and emerging.
      </p>
    </div>

    <div className={styles.footerSocial}>
      <a href="https://twitter.com"><FaTwitter size={32} /></a>
      <a href="https://instagram.com"><FaInstagram size={32} /></a>
      <a href="https://youtube.com"><FaYoutube size={32} /></a>
      <a href="https://tiktok.com"><FaTiktok size={32} /></a>
    </div>
    </div>
    
  </div>
</footer>




    </div>
  );
};

export default LandingPage;