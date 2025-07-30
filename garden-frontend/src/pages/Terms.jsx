import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import '../styles/pagestyles/Legal.scss';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Terms = () => {
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
            <h1>Terms & Conditions</h1>
            <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>

            <section>
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using the Community Garden Management System ("Service"), 
                you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2>2. Use License</h2>
              <p>
                Permission is granted to temporarily use the Service for personal, 
                non-commercial transitory viewing only. This is the grant of a license, 
                not a transfer of title, and under this license you may not:
              </p>
              <ul>
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the Service</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2>3. Garden Plot Responsibilities</h2>
              <p>
                Users assigned garden plots agree to:
              </p>
              <ul>
                <li>Maintain their assigned plot in good condition</li>
                <li>Follow organic gardening practices as outlined by garden managers</li>
                <li>Respect other gardeners' plots and common areas</li>
                <li>Participate in community maintenance activities when requested</li>
                <li>Report any issues or concerns promptly through the platform</li>
              </ul>
            </section>

            <section>
              <h2>4. User Conduct</h2>
              <p>
                Users must not:
              </p>
              <ul>
                <li>Use the Service for any unlawful purpose</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Upload malicious content or spam</li>
                <li>Attempt to gain unauthorized access to other accounts</li>
                <li>Interfere with the proper functioning of the Service</li>
              </ul>
            </section>

            <section>
              <h2>5. Plot Ownership Disclaimer</h2>
              <p>
                Garden plots are assigned for use only and do not constitute ownership. 
                The platform reserves the right to reassign plots based on availability, 
                maintenance requirements, or community needs.
              </p>
            </section>

            <section>
              <h2>6. Privacy and Data</h2>
              <p>
                Your privacy is important to us. Please review our Privacy Policy, 
                which also governs your use of the Service, to understand our practices.
              </p>
            </section>

            <section>
              <h2>7. Termination</h2>
              <p>
                We may terminate or suspend your account and access to the Service 
                immediately, without prior notice, for conduct that we believe violates 
                these Terms or is harmful to other users, us, or third parties.
              </p>
            </section>

            <section>
              <h2>8. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify 
                users of any changes by posting the new Terms on this page and updating 
                the "Last updated" date.
              </p>
            </section>

            <section>
              <h2>9. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us through 
                our support system or at the contact information provided on our platform.
              </p>
            </section>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
