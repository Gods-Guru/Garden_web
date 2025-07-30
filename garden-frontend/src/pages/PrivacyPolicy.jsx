import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import '../styles/pagestyles/Legal.scss';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <Navbar />
      
      <main className="legal-main">
        <motion.div 
          className="legal-container"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="container">
            <h1>Privacy Policy</h1>
            <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>

            <section>
              <h2>1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you:
              </p>
              <ul>
                <li>Create an account</li>
                <li>Apply for a garden plot</li>
                <li>Participate in community events</li>
                <li>Contact our support team</li>
                <li>Upload photos or content to your garden log</li>
              </ul>
            </section>

            <section>
              <h2>2. How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul>
                <li>Provide, maintain, and improve our services</li>
                <li>Process plot applications and assignments</li>
                <li>Send you notifications about garden activities</li>
                <li>Respond to your comments and questions</li>
                <li>Analyze usage patterns to improve user experience</li>
              </ul>
            </section>

            <section>
              <h2>3. Information Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information 
                to third parties without your consent, except as described in this policy:
              </p>
              <ul>
                <li>With garden managers for plot management purposes</li>
                <li>With other community members for coordination (name and contact info only)</li>
                <li>When required by law or to protect our rights</li>
                <li>With service providers who assist in operating our platform</li>
              </ul>
            </section>

            <section>
              <h2>4. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or 
                destruction. However, no method of transmission over the Internet 
                is 100% secure.
              </p>
            </section>

            <section>
              <h2>5. Photo and Content Rights</h2>
              <p>
                When you upload photos or content to your garden log:
              </p>
              <ul>
                <li>You retain ownership of your content</li>
                <li>You grant us permission to display it within the platform</li>
                <li>You can delete your content at any time</li>
                <li>We may use anonymized garden photos for promotional purposes</li>
              </ul>
            </section>

            <section>
              <h2>6. Cookies and Tracking</h2>
              <p>
                We use cookies and similar technologies to:
              </p>
              <ul>
                <li>Remember your login status</li>
                <li>Understand how you use our platform</li>
                <li>Improve our services</li>
                <li>Provide personalized content</li>
              </ul>
            </section>

            <section>
              <h2>7. Your Rights</h2>
              <p>
                You have the right to:
              </p>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of non-essential communications</li>
                <li>Export your garden log data</li>
              </ul>
            </section>

            <section>
              <h2>8. Children's Privacy</h2>
              <p>
                Our service is not intended for children under 13. We do not knowingly 
                collect personal information from children under 13. If you are a parent 
                and believe your child has provided us with personal information, 
                please contact us.
              </p>
            </section>

            <section>
              <h2>9. Changes to Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify 
                you of any changes by posting the new Privacy Policy on this page 
                and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2>10. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact 
                us through our support system or at the contact information provided 
                on our platform.
              </p>
            </section>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
