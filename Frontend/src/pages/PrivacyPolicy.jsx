import React from "react";

const PrivacyPolicy = () => {
  return (
    <>
      {/* Simple fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>

      <div className="fade-in max-w-3xl mx-auto mt-10 mb-18 p-6 bg-white shadow-2xl rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-14">Privacy policy</h1>

        <div className="mb-10">
          <p className="text-gray-700">
            For information about how we collect and use training information to
            develop our language models that power LawMitra and other Services,
            and your choices with respect to that information.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">1. Personal Data we collect</h2>
          <p className="text-gray-700 mb-4">
            We collect personal data relating to you (“Personal Data”) as follows:
          </p>

          <ul className="list-disc list-outside pl-5 mt-2 text-gray-700">
            <li>
              <strong>Account Information:</strong> When you create an account
              with us, we collect information associated with your account,
              including your name, contact information, account credentials, date
              of birth, payment information, and transaction history.
            </li>
            <li>
              <strong>User Content:</strong> We collect Personal Data that you
              provide in the input to our Services (“Content”), including your
              prompts and other content you upload, depending on the features you
              use.
            </li>
            <li>
              <strong>Communication Information:</strong> If you communicate with
              us, such as via email or social media pages, we may collect Personal
              Data like your name, contact information, and the contents of the
              messages you send.
            </li>
            <li>
              <strong>Other Information You Provide:</strong> We collect other
              information that you provide to us, such as when you participate in
              our events or surveys or provide us with information to establish
              your identity or age.
            </li>
          </ul>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">2. How we use Personal Data</h2>
          <p className="text-gray-700 mb-4">
            We may use Personal Data for the following purposes:
          </p>

          <ul className="list-disc list-outside pl-5 mt-2 text-gray-700">
            <li>
              To provide, analyze, and maintain our Services, for example, to
              respond to your questions for LawMitra.
            </li>
            <li>
              To improve and develop our Services and conduct research, for
              example, to develop new product features.
            </li>
            <li>
              To communicate with you, including sending information about our
              Services and events, such as updates or changes.
            </li>
            <li>
              To prevent fraud, illegal activity, or misuse of our Services, and
              to protect the security of our systems.
            </li>
          </ul>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">3. Retention</h2>
          <p className="text-gray-700 mb-4">
            We’ll retain your Personal Data for only as long as we need in order
            to provide our Services to you, or for other legitimate business
            purposes such as resolving disputes, safety and security reasons, or
            complying with our legal obligations. How long we retain Personal Data
            will depend on a number of factors, such as:
          </p>

          <ul className="list-disc list-outside pl-5 mt-2 text-gray-700">
            <li>
              Our purpose for processing the data (such as whether we need to
              retain the data to provide our Services);
            </li>
            <li>The amount, nature, and sensitivity of the information;</li>
            <li>
              The potential risk of harm from unauthorized use or disclosure;
            </li>
            <li>Any legal requirements that we are subject to.</li>
          </ul>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">4. Your rights</h2>
          <p className="text-gray-700 mb-4">
            Depending on where you live, you may have certain statutory rights in
            relation to your Personal Data. For example, you may have the right
            to:
          </p>

          <ul className="list-disc list-outside pl-5 mt-2 text-gray-700">
            <li>
              Access your Personal Data and information relating to how it is
              processed.
            </li>
            <li>Delete your Personal Data from our records.</li>
            <li>Update or correct your Personal Data.</li>
            <li>
              Transfer your Personal Data to a third party (right to data
              portability).
            </li>
            <li>Restrict how we process your Personal Data.</li>
            <li>
              Withdraw your consent—where we rely on consent as the legal basis
              for processing at any time.
            </li>
            <li>Object to how we process your Personal Data.</li>
            <li>
              Lodge a complaint with your local data protection authority.
            </li>
          </ul>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">5. Security</h2>
          <p className="text-gray-700 mb-4">
            We implement commercially reasonable technical, administrative, and
            organizational measures designed to protect Personal Data from loss,
            misuse, and unauthorized access, disclosure, alteration, or
            destruction. However, no Internet or email transmission is ever fully
            secure or error free. Therefore, you should take special care in
            deciding what information you provide to the Services. In addition, we
            are not responsible for circumvention of any privacy settings or
            security measures contained on the Service, or third-party websites.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">
            6. Changes to the privacy policy
          </h2>
          <p className="text-gray-700 mb-4">
            We may update this Privacy Policy from time to time. When we do, we
            will publish an updated version and effective date on this page,
            unless another type of notice is required by applicable law.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">7. How to contact us</h2>
          <p className="text-gray-700 mb-4">
            Please contact support(Email: lawmitra@gmail.com) if you have any
            questions or concerns not already addressed in this Privacy Policy.
          </p>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
