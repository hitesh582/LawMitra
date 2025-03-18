import React from "react";

const TermsOfUse = () => {
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
        <h1 className="text-3xl font-bold text-center mb-14">Terms of Use</h1>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">Registration and Access</h2>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold">Minimum Age</h3>
          <p className="text-gray-700">
            You must be at least 13 years old or the minimum age required in your
            country to consent to use the Services. If you are under 18 you must
            have your parent or legal guardian’s permission to use the Services.
          </p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold">Registration</h3>
          <p className="text-gray-700">
            You must provide accurate and complete information to register for an
            account to use our Services. You may not share your account
            credentials or make your account available to anyone else and are
            responsible for all activities that occur under your account. If you
            create an account or use the Services on behalf of another person or
            entity, you must have the authority to accept these Terms on their
            behalf.
          </p>
        </div>

        <div className="mb-4 mt-10">
          <h2 className="text-xl font-semibold">Using our Services</h2>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold">What you can do</h3>
          <p className="text-gray-700">
            You must be at least 13 years old or the minimum age required in your
            country to consent to use the Services. If you are under 18 you must
            have your parent or legal guardian’s permission to use the Services.
          </p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold">What you cannot do</h3>
          <p className="text-gray-700">
            You may not use our Services for any illegal, harmful, or abusive activity. For example, you may not:
          </p>
          <ul className="list-disc list-outside pl-5 text-black">
            <li>Avoid using our Services in a way that infringes, misappropriates, or violates anyone’s rights.</li>
            <li>Modify, copy, lease, sell, or distribute any of our Services.</li>
            <li>Attempt to or assist anyone to reverse engineer, decompile, or discover the source code or underlying components of our Services.</li>
            <li>Automatically or programmatically extract data or Output (defined below).</li>
            <li>Represent that Output was human-generated when it was not.</li>
            <li>Interfere with or disrupt our Services, including circumventing any rate limits or restrictions or bypassing any protective measures or safety.</li>
            <li>Use Output to develop models that compete with LawMitra.</li>
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold">Software</h3>
          <p className="text-gray-700">
            Our Services may allow you to download software, such as mobile applications, which may update automatically to ensure you’re using the latest version. Our software may include open source software that is governed by its own licenses that we’ve made available to you.
          </p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold">Corporate domains</h3>
          <p className="text-gray-700">
            If you create an account using an email address owned by an organization (for example, your employer), that account may be added to the organization's business account with us, in which case we will provide notice to you so that you can help facilitate the transfer of your account (unless your organization has already provided notice to you that it may monitor and control your account). Once your account is transferred, the organization’s administrator will be able to control your account, including being able to access Content (defined below) and restrict or remove your access to the account. 
          </p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold">Third party Services</h3>
          <p className="text-gray-700">
            Our services may include third party software, products, or services, (“Third Party Services”) and some parts of our Services, like our browse feature, may include output from those services (“Third Party Output”). Third Party Services and Third Party Output are subject to their own terms, and we are not responsible for them.
          </p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold">Feedback</h3>
          <p className="text-gray-700">
            We appreciate your feedback, and you agree that we may use it without restriction or compensation to you.
          </p>
        </div>
      </div>
    </>
  );
};

export default TermsOfUse;
