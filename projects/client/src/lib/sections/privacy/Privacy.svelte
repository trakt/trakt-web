<script lang="ts">
  import { SUPPORT_EMAIL } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import LegalPage from "$lib/components/legal/LegalPage.svelte";
</script>

<LegalPage 
  title="Trakt Privacy Policy"
  lastUpdated="August 20, 2024"
>
  <svelte:fragment slot="intro">
    <p>
      Welcome to Trakt! This Privacy Policy explains how we at trakt, inc. (<b
        >"Trakt,"</b
      > <b>"us,"</b> <b>"our,"</b> or <b>"we"</b>) collect and treat information
      when you use trakt.tv or its subdomains, the Trakt mobile application (the
      <b>"App"</b>), our user forums, and other features and services we offer
      (collectively, our <b>"Services"</b>). This Privacy Policy is governed by
      and part of our Terms of Use. Any terms defined in the
      <a href={UrlBuilder.terms()}>Terms of Use</a>
      have the same meaning when used in this Privacy Policy. Please note that this
      Privacy Policy
      <u><b>does not</b></u> apply to any third-party platforms, such as the third-party
      content streaming services you may use in conjunction with our Services.
    </p>
  </svelte:fragment>

  <svelte:fragment slot="summary">
    <h2>Let's Get Right To The Point</h2>
    <p>
      Trakt wants you to have a clear understanding of how we collect, protect,
      and use your information. Here is a summary of Trakt's privacy promise to
      you:
    </p>
    <ul>
      <li>
        Trakt never sells your personal information or data. <em>Ever.</em>
      </li>
      <li>
        You can always login to update or control the information associated
        with your Trakt account.
      </li>
      <li>
        Trakt doesn't display lame programtic ads from third parties. Any ads
        you see will be from Trakt directly or trusted affiliates.
      </li>
      <li>You can unsubscribe from Trakt marketing emails anytime.</li>
      <li>
        Trakt only works with service providers and affiliates that meet or
        exceed our own privacy standards.
      </li>
      <li>
        Trakt welcomes your questions and comments about our privacy practices.
      </li>
    </ul>
  </svelte:fragment>
    <p>
      Please read this Privacy Policy carefully to fully understand our privacy
      practices. Our Privacy Policy may be updated from time to time, and we
      will notify you of any material changes by posting the new Privacy Policy
      for the Sites at <a href={UrlBuilder.privacy()}>http://trakt.tv/privacy</a
      >. If you have any questions about this Privacy Policy, please contact
      us at
      <a href="mailto:{SUPPORT_EMAIL}">{SUPPORT_EMAIL}</a>.
    </p>

    <!-- Section 1 -->
    <div class="legal-section" id="section-1">
      <h2><span class="number">1</span>Consent</h2>
      <p>
        By accessing or using our Services in any manner, you consent to our
        privacy practices described in this Privacy Policy. If you do not agree
        with this Privacy Policy, do not access or use our Services.
      </p>
    </div>

    <!-- Section 2 -->
    <div class="legal-section" id="section-2">
      <h2><span class="number">2</span>Personal Information</h2>
      <p>
        As used in this Privacy Policy, <b>"Personal Information"</b> means any information
        that identifies, relates to, describes, is reasonably capable of being associated
        with, or could reasonably be linked, directly or indirectly, with a particular
        consumer or household. Personal Information falls within certain categories,
        for example:
      </p>
      <ol type="a">
        <li>
          Identifiers (e.g., name, email, telephone number, address, username);
        </li>
        <li>
          Sensitive Personal Information (e.g., precise geolocation; race or
          ethnic origin; religious beliefs; health information; contents
          messages when we are not the recipient);
        </li>
        <li>
          Legally protected information (e.g., race, citizenship, marital
          status, sex);
        </li>
        <li>
          Employment-related information (e.g. current or past employment);
        </li>
        <li>
          Non-public educational information, including information protected
          under the Family Educational Rights and Privacy Act (20 U.S.C. &sect;
          1232g, 34 C.F.R. Part 99);
        </li>
        <li>
          Biometrics (e.g., DNA, face/voice prints, health data) and audio,
          electronic, visual, thermal, or olfactory information;
        </li>
        <li>
          Inferences drawn from Personal Information to create a profile about
          preferences, characteristics, trends, predispositions, behavior,
          attitudes, intelligence, and aptitudes;
        </li>
        <li>
          Commercial information (e.g., products or services purchased,
          obtained, or considered, or other purchasing or consuming histories or
          tendencies); and
        </li>
        <li>
          Internet or other similar activity (e.g., browsing history; content
          interactions).
        </li>
      </ol>
      <p>
        Information that <u><b>is not</b></u> protected as Personal Information includes
        publicly available information; aggregated information (meaning data summaries
        or reports with the Personal Information removed); or de-identified information
        that cannot be easily linked back to the individual.
      </p>
    </div>

    <!-- Section 3 -->
    <div class="legal-section" id="section-3">
      <h2><span class="number">3</span>Children's Privacy</h2>
      <p>
        Our Services are not directed to children under 18. We do not knowingly
        collect Personal Information from children under 18. If we learn we have
        collected or received Personal Information from a child under 18, we
        will delete that information. Please contact us at
        <a href="mailto:{SUPPORT_EMAIL}">{SUPPORT_EMAIL}</a> if you believe we have
        received information from a child under 18.
      </p>
    </div>

    <!-- Section 4 -->
    <div class="legal-section" id="section-4">
      <h2>
        <span class="number">4</span>Categories and Sources of Personal
        Information Collected
      </h2>
      <p>
        Trakt may collect Personal Information (a) with your consent; (b) if we
        have a legitimate interest in doing so; or (c) as authorized or required
        by law. We only collect, use, retain, and disclose Personal Information
        as reasonably necessary and proportionate to provide our Services or for
        other purposes that we disclose to you and are compatible with the
        context of how we collected your Personal Information. During the
        preceding 12 months, we have collected Personal Information in the
        categories of identifiers, commercial information, inferences and
        internet or similar activity. We collect this information from you and
        your interactions with the Services including:
      </p>
      <ol type="a">
        <li>
          <b>Your Trakt Account, with your consent.</b> When you sign up for Trakt
          and create your profile, we may collect identifiers like your name and email
          address, as well as your general location. We use this information to give
          you access to the Services and to offer you software updates and product
          announcements. You can also include commercial information in your profile
          like your content preferences and interests, which we may use to generate
          inferences about you as a user of our Services. If you participate in our
          user forum, VIP user opportunities, or other interactive features, we will
          collect and process any Personal Information you submit for those purposes.
          We collect this information with your consent, and we use it to provide
          you with the Services you request, communicate with you about Trakt, and
          send you marketing messages according to your preferences.
        </li>
        <li>
          <b
            >Your Scrobble &amp; Sync activities, to achieve a legitimate
            interest.</b
          >
          If you install the Scrobble plug-in, Trakt will track all of the content
          you watch to keep your devices in sync across the various applications you
          use. We also collect data about your content interactions to personalize
          your experience and to improve our Services. We may process this data to
          serve you with targeted advertisements based on your content and communication
          preferences or aggregate the data to recommend popular content to other
          users and to analyze trends in user interests.
        </li>
        <li>
          <b
            >Technical data from your use of the Services, to achieve a
            legitimate interest.</b
          >
          We use cookies and related technologies (as described under
          <a href="#section-5">Cookies</a>) to collect technical data, including
          some Personal Information, from your use of the Services. For example,
          we may automatically collect your (i) browsing history; (ii) device
          information (e.g., IP address, browser type, device ID); (iii) content
          interactions; (iv) generalized geolocation; and (v) web traffic data
          to understand how users access the Services and to troubleshoot
          technical issues. Trakt may use this data to identify third-party ad
          content that is relevant to you and to serve those advertisements to
          you on the Services or on social media or other platforms that you
          use, according to your stated preferences (see
          <a href="#section-8">Your Privacy Rights</a>
          for more information). We collect and process this information to achieve
          our legitimate interests of providing you with the Services to which you
          subscribe and improving our technology and the Services we offer.
        </li>
      </ol>
      <p>
        Trakt might also use your Personal Information to: (i) monitor your
        compliance with any of your agreements with us; (ii) protect your
        privacy and enforce this Privacy Policy; (iii) if we believe it is
        necessary, to identify, contact, or bring legal action against persons
        or entities who may be causing injury to you, to us, or to others; (iv)
        comply with a law, regulation, legal process, or court order; or (v)
        fulfill any other purpose to which you consent.
      </p>
    </div>

    <!-- Section 5 -->
    <div class="legal-section" id="section-5">
      <h2><span class="number">5</span>Cookies</h2>
      <p>
        Trakt uses cookies and related technologies to collect information,
        including some Personal Information for analytics, tracking, and
        advertising purposes. Cookies allow websites and platforms to analyze
        user trends, remember a user from one session to the next, and enable
        certain features to function. Trakt uses first party cookies to support
        your account login and other essential functions. Details about Trakt
        cookie use is below.
      </p>
      <div class="table-wrapper">
        <table class="cookies-table">
          <thead>
            <tr>
              <th>Cookie</th>
              <th>Function</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                Trakt
                <span class="helper">_traktsession + lots more</span>
              </td>
              <td>
                First party cookies used to collect browser, session, and
                operational data to enable the Services to function on your
                device.
              </td>
              <td>Strictly Necessary</td>
            </tr>
            <tr>
              <td>
                Amazon AWS
                <span class="helper">AWS*</span>
              </td>
              <td>Server load balancing and session management.</td>
              <td>Strictly Necessary</td>
            </tr>
            <tr>
              <td>
                Watch Now
                <span class="helper">watchnow*</span>
              </td>
              <td>
                Collects country location to offer streaming links available in
                your country.
              </td>
              <td>Functionality</td>
            </tr>
            <tr>
              <td>
                Firebase
                <span class="helper">_ga*</span>
              </td>
              <td>Internal metrics to help improve Trakt.</td>
              <td>Analytics</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        You can adjust your device settings or install a third-party plugin to
        prevent cookies from interacting with your device or collecting your
        Personal Information. However, doing this will prevent you from using
        certain features on the Services.
      </p>
    </div>

    <!-- Section 6 -->
    <div class="legal-section" id="section-6">
      <h2><span class="number">6</span>Retention of Personal Information</h2>
      <p>
        Trakt retains Personal Information for the minimum period necessary to
        provide you with the Services you request. Personal Information
        associated with your user account is retained until you delete it or
        cancel your account. If you cancel your account, Trakt will delete or
        anonymize all of your Personal Information then mark the account as
        private and schedule it for deletion. An account cannot be restored once
        deleted. User comments posted to Trakt forums are retained indefinitely
        unless you request deletion. Data collected via cookies and similar
        technologies is kept for up to 26 months. We may retain data, including
        Personal Information, for longer periods if it is critical to our
        business and securely stores that retained data. For example, we may
        retain de-identified data about your content interactions in perpetuity
        for purposes like supporting our Discover feature, analyzing user
        behavior on an aggregate level, or improving our Services. Trakt
        regularly reviews and deletes or deidentifies unnecessary data.
      </p>
    </div>

    <!-- Section 7 -->
    <div class="legal-section" id="section-7">
      <h2><span class="number">7</span>Disclosing Personal Information</h2>
      <p>
        Trakt will only disclose Personal Information to the third parties as
        described in this section, with your permission, or as required by law.
        In the preceding 12 months, we have disclosed identifiers, commercial
        information, inferences and internet or similar activity to third-party
        recipients for a business purpose. We may disclose this information to
        the following recipients:
      </p>
      <ol type="a">
        <li>
          <b>Other Trakt Users.</b> Personal Information you include in your user
          forum messages and your public profile may be viewable or accessible by
          other Trakt users. Please think carefully about the Personal Information
          you make available to others on the Services. You can review and revise
          your profile information at any time.
        </li>
        <li>
          <b>Service Providers.</b> Trakt uses third-party service providers like
          data hosting companies, analytics services, and payment processors that
          may have access to your Personal Information to perform their contractual
          obligations to us. The type of information that we disclose to a service
          provider will depend on the service that they provide to us. Our service
          providers are subject to contractual agreements that protect your Personal
          Information, and we require all service providers to maintain confidentiality
          standards that are commercially reasonable to ensure the security of your
          Personal Information.
        </li>
        <li>
          <b>Cookie Data Recipients.</b> We may permit certain trusted third
          parties to place cookies, pixels, and related technologies on your
          browser subject to your device settings. These technologies capture
          data that is transmitted back to the trusted third party so Trakt can
          market to you on corresponding social media channels and other
          platforms. You can opt-out of our use of your Personal Information in
          this manner by contacting
          <a href="mailto:{SUPPORT_EMAIL}">{SUPPORT_EMAIL}</a> or updating your device
          settings to control how these technologies interact with your browser.
        </li>
        <li>
          <b>Affiliates.</b> We may disclose the information we collect from you to
          our affiliates or subsidiaries in accordance with applicable privacy laws.
        </li>
        <li>
          <b>Other Third Parties,</b> as permitted by applicable law. For example:
          if we go through a business transition (e.g., merger, acquisition, or sale
          of a portion of our assets); to comply with a legal requirement or a court
          order; when we believe it is appropriate to take action regarding illegal
          activities or prevent fraud or harm to any person; to exercise or defend
          our legal claims; or for any other reason with your consent.
        </li>
        <li>
          <b>Law enforcement,</b> and other governmental agencies, at our sole discretion
          in connection with an investigation of any matter that is illegal or that
          could expose Trakt or our affiliates or subsidiaries to liability.
        </li>
        <li>
          <b>Aggregated and De-Identified Information.</b> Trakt reserves the right
          to disclose aggregated, anonymized, or de-identified information about any
          individuals with non-affiliated entities for research, product development,
          marketing, or other purposes, without restriction.
        </li>
      </ol>
    </div>

    <!-- Section 8 -->
    <div class="legal-section" id="section-8">
      <h2><span class="number">8</span>Your Privacy Rights</h2>
      <p>
        This section offers instructions to control how Trakt collects and uses
        your Personal Information and provides the notices of privacy rights as
        required under the laws applicable to residents of California and other
        US states, Canada, and the EEA and UK.
      </p>
      <ol type="a">
        <li>
          <b>Controlling Your Personal Information.</b> Trakt provides you a variety
          of methods and options to exercise controls over your Personal Information,
          such as:
        </li>
        <ol type="i">
          <li>
            <b>Your Account.</b> You can review, update, correct or delete the
            Personal Information associated with your Trakt account at any time
            by logging into your account and saving your changes. Please visit
            your <a href={UrlBuilder.settings.general()}>account settings</a> to view
            available options to access, correct, delete, or limit Trakt's use of
            your Personal Information. Note that deleting your account removes any
            Personal Information attached with your account and anonymizes your statistical
            data.
          </li>
          <li>
            <b>Marketing.</b> We may use your contact information to send you
            marketing communications in compliance with applicable law. You may
            opt-out of our marketing messages at any time by updating your
            account preferences, clicking the "Unsubscribe" button contained in
            our emails, texting STOP in reply to our text messages, or by
            sending a request to
            <a href="mailto:{SUPPORT_EMAIL}">{SUPPORT_EMAIL}</a>.
          </li>
          <li>
            <b>Profiling and Data Sharing.</b> You can opt-out of Trakt's
            algorithm used to personalize your user experience or sharing your
            Personal Information for cross-contextual advertising by emailing
            <a href="mailto:{SUPPORT_EMAIL}">{SUPPORT_EMAIL}</a> and/or adjusting
            your device settings as described below.
          </li>
          <li>
            <b>Device Settings.</b> You can control the data we collect through automated
            means by adjusting your device settings, such as blocking pop-up ads or
            cookies, or by installing a third-party plugin to control how cookies
            interact with your device.
          </li>
          <li>
            <b>Do Not Track.</b> Do Not Track signals are signals sent through a browser
            informing us that you do not want to be tracked. Currently, our systems
            do not recognize browser "do-not-track" requests, but you may disable
            certain tracking via your device settings.
          </li>
        </ol>

        <li>
          <b>Consumer Privacy Requests.</b> If you wish to control your Personal
          Information beyond the methods described above, or if you want to
          express concerns, lodge a complaint, or request information, please
          send a verifiable Consumer Privacy Request by email to
          <a href="mailto:{SUPPORT_EMAIL}">{SUPPORT_EMAIL}</a> with a subject
          line <b>"Privacy Request."</b> Please send the email from the same address
          attached to your Trakt account and include your Trakt username to verify
          your identity. Trakt will honor your Consumer Privacy Request to the extent
          provided under the laws that apply to you and to our business.
        </li>
        <p>
          Trakt can only fulfill a Consumer Privacy Request when we have
          sufficient information to verify that the requester is the person or
          an authorized representative of the person about whom we have
          collected Personal Information, and to properly understand, evaluate,
          and respond to the request. We do not charge a fee to process or
          respond to a verifiable request unless we have legal grounds to do so.
          If we determine that the request warrants a fee, we will tell you why
          we made that decision and provide you with a cost estimate before
          completing your request. We endeavor to respond to Consumer Privacy
          Requests in accordance with the requirements of the law applicable to
          your jurisdiction.
        </p>

        <li>
          <b>California and Certain Other U.S. States.</b> This section provides
          the disclosures and notices required under the California Consumer
          Privacy Act of 2018 (<b>"CCPA"</b>) and offers informational notices
          to residents of Virginia, Colorado, Nevada, and other U.S. states with
          laws providing similar protections.
          <b
            >NOTE THAT TRAKT IS NOT CURRENTLY GOVERNED BY THE CCPA AND IS EXEMPT
            FROM CERTAIN OTHER US PRIVACY LAWS.</b
          >
          This section is offered as a courtesy to describe the rights afforded to
          residents of the State of California and other states to the extent the
          same legal protections apply (each a <b>"Consumer"</b>). Consumers may
          exercise the rights below to the extent provided by the laws that
          apply to the Consumer and to Trakt, subject to our receipt of a
          verifiable Consumer Privacy Request and any exceptions and limitations
          that may apply:
        </li>
        <ol type="i">
          <li>
            <b>Right to Correct.</b> You may request that we correct inaccurate Personal
            Information about you on our systems. If you become aware that the Personal
            Information that we hold about you is incorrect, or if your information
            changes, please inform us and we will update our records.
          </li>
          <li>
            <b>Right to Deletion.</b> You have the right to request that we delete
            any of your Personal Information that we collected and retained, with
            certain exceptions. Trakt may permanently delete, deidentify, or aggregate
            the Personal Information in response to a request for deletion. If you
            submit a Consumer Privacy Request to delete your Personal Information,
            we will confirm the Personal Information to be deleted prior to its deletion,
            and we will notify you when your request is complete.
          </li>
          <li>
            <b>Limited Use and Disclosure of Sensitive Personal Information.</b>
            Trakt does not seek to collect sensitive Personal Information about any
            individual. In no case will Trakt use or disclose any sensitive Personal
            Information for the purpose of inferring characteristics about you. If
            this ever changes in the future, we will update this Privacy Policy and
            provide you with a method to limit use and disclosure of your sensitive
            Personal Information.
          </li>
          <li>
            <b>Opt-Out of Sharing Personal Information.</b> As part of the
            Services, Trakt might shares certain Personal Information with
            trusted third parties. For example, we may place cookies on your
            browser to track the performance of Trakt or affiliate ads. To
            opt-out of this sharing of your Personal Information, you may email
            us at <a href="mailto:{SUPPORT_EMAIL}">{SUPPORT_EMAIL}</a>. Note
            that if you opt-out of sharing your Personal Information, Trakt
            features like Discover or Scrobble may not function.
          </li>
          <li>
            <b>Opt-Out of Profiling.</b> Trakt uses algorithms to personalize
            your experience using our Services which may include evaluation,
            analysis, or prediction of your interests and preferences. All
            profiling is generated from information you include in your account
            profile and how you interact with our Services, and our use of
            profiling will not impact your access to our Services. To opt-out of
            a tailored experience, or to learn more about how we use automated
            profiling to improve your user experience, please contact
            <a href="mailto:{SUPPORT_EMAIL}">{SUPPORT_EMAIL}</a> or submit a consumer
            privacy request.
          </li>
          <li>
            <b>No CCPA Sale of Personal Information.</b> Trakt does not exchange Personal
            Information with third parties for compensation. If this changes in the
            future, we will update this Privacy Policy and provide a method to opt-out
            of such sale.
          </li>
          <li>
            <b>Right to Access.</b> You have the right to request that we provide
            you with access to specific pieces of Personal Information we have collected
            about you over the past 12 months (also called a data portability request).
            If you submit an access request, we will provide you with copies of the
            requested pieces of Personal Information in a portable and readily usable
            format. Please note that Trakt may be prohibited by law from disclosing
            pieces of Personal Information that would create a substantial, articulable,
            and unreasonable risk to the security of the information, our business
            systems, or your account. Under the CCPA, Trakt is only required by law
            to respond to two access requests within a 12-month period.
          </li>
          <li>
            <b>Right to Disclosure.</b> You may request that we disclose information
            to you about our collection and use of your Personal Information over
            the past 12 months, such as: (a) the categories of Personal Information
            we have collected about you; (b) the categories of sources for the Personal
            Information we have collected about you; (c) our business purpose for
            collecting or selling that Personal Information; (d) the categories of
            third parties with whom we share that Personal Information; and (e) if
            we sold or shared your Personal Information under the CCPA, two separate
            lists stating: (i) sales or sharing, identifying the Personal Information
            categories that each category of recipient purchased; and (ii) disclosures
            for a business purpose, identifying the Personal Information categories
            that each category of recipient obtained. Under the CCPA, Trakt is only
            required to respond to two disclosure requests within a 12-month period.
          </li>
          <li>
            <b>Right to Nondiscrimination.</b> We will not discriminate against you
            for exercising your privacy rights. Unless permitted by law, we will not:
            (i) deny you goods or services; (ii) charge you different prices or rates
            for goods or services; (iii) provide you a different level or quality
            of goods or services; (iv) retaliate against you as an employee, applicant
            for employment, or independent contractor for exercising your privacy
            rights; or (v) suggest that you may receive a different price or rate
            for goods or services or a different level or quality of goods or services,
            because you exercised a right under applicable privacy laws.
          </li>
          <li>
            <b>Right to Disclosure of Marketing Information.</b> California's Shine
            the Light Act (Civil Code sections 1798.83-1798.84) entitles California
            residents to request certain disclosures regarding Personal Information
            sharing with affiliates and/or third parties for marketing purposes.
          </li>
        </ol>

        <li>
          <b>Canada.</b> We adopted this section to provide supplemental
          information in compliance with Canada's Personal Information
          Protection and Electronic Documents Act (<b>"PIPEDA"</b>). This
          section applies solely to residents of Canada where PIPEDA applies (<b
            >"Canadian Consumers"</b
          >). PIPEDA gives Canadian Consumers specific rights regarding Personal
          Information offering details on an identifiable person without the
          inclusion of name, title, telephone number, and business address of an
          employee of a business or organization. The following paragraphs
          describe PIPEDA rights and explain how to exercise those rights.
        </li>
        <ol type="i">
          <li>
            <b>Right to know</b> why we collect, use, and distribute the Personal
            Information we process. We have set the required notices in this Privacy
            Policy. We may provide you with additional notices about other ways we
            process your Personal Information, such as by sending you a notice via
            email or by other means of communication.
          </li>
          <li>
            <b>Right to expect</b> us to collect, use, or disclose Personal
            Information responsibly and not for any other purpose other than
            which you consented. We set your expectations in this Privacy Policy
            and collect express or implied consent at various stages of
            collection or processing. If we collect or use your Personal
            Information based on your consent, we will also notify you of any
            changes and will request your further consent as needed. You may
            withdraw your consent at any time with reasonable notice to
            <a href="mailto:{SUPPORT_EMAIL}">{SUPPORT_EMAIL}</a>.
          </li>
          <li>
            <b>Right to accuracy</b> of your Personal Information. We take steps to
            reasonably ensure that your Personal Information we are using is accurate.
            In most cases, we rely on you to ensure that your information is current,
            complete, and accurate. We provide methods for you to correct, update,
            and delete inaccurate Personal Information in your account, and we will
            provide you with reasonable assistance to ensure that your Personal Information
            is accurate in our systems and with our service providers.
          </li>
          <li>
            <b>Right to access</b> your Personal Information. Upon written request
            and identity authentication, we will provide you with your Personal Information
            under our control, information about the ways in which that information
            is being used and a description of the individuals and organizations to
            whom that information has been disclosed. We will make the information
            available within 30 days or provide written notice where additional time
            is required to fulfil the request. If limited by law or potential infringement
            on another's privacy rights, we may not be able to provide access to some
            or all of the Personal Information you request. If we must refuse an access
            request, we will notify you in writing, document the reasons for refusal,
            and outline further steps that are available to you.
          </li>
        </ol>

        <li>
          <b>European Economic Area and United Kingdom.</b> We adopted this
          section to comply with the General Data Protection Regulations (<b
            >"GDPR"</b
          >) and its counterpart regulation applicable to residents of the
          United Kingdom. This section applies solely to residents of the EEA
          and the United Kingdom (<b>"Data Subjects"</b>). Trakt collects and
          processing Personal Information of Data Subjects as a controller. If
          you are a Data Subject, you have the following rights in relation to
          the Personal Information we hold about you:
        </li>
        <ol type="i">
          <li>
            <b>Right to know</b> how we process your Personal Information. We have
            set the required notices in this Privacy Policy. We may provide you with
            additional notices about other ways we process your Personal Information,
            such as by sending you a notice via email or by other means of communication.
          </li>
          <li>
            <b>Right to access</b> your Personal Information. You can request to
            access your Personal Information by emailing
            <a href="mailto:{SUPPORT_EMAIL}">{SUPPORT_EMAIL}</a>. Upon request,
            we will provide you with a copy of your Personal Information, along
            with details about the types of Personal Information we process, why
            we process it, and any third parties we work with to collect
            Personal Information on our behalf. We may have one or more legally
            valid reasons to refuse your request in whole or in part, for
            example, to protect the rights of other individuals.
          </li>
          <li>
            <b>Right to restrict processing</b> of your Personal Information. You
            can request that we restrict the processing of your Personal Information
            if: (i) the data is inaccurate; (ii) the processing is unlawful; (iii)
            we no longer need the Personal Information; or (iv) you exercise your
            right to object.
          </li>
          <li>
            <b>Right to rectify your Personal Information.</b> If you become aware
            that the Personal Information that we hold about you is incorrect, or
            if your information changes, please inform us and we will update our records.
          </li>
          <li>
            <b>Right to data portability.</b> In some circumstances, we are required
            to provide your Personal Information to another organization at your request
            and in a structured, commonly used machine-readable format, so that the
            other organization can read and use it.
          </li>
          <li>
            <b>Right to erasure</b> (a.k.a. the <b>"right to be forgotten"</b>).
            Upon your request, and in certain circumstances and where we are
            required to do so by law, we are required to delete or anonymize
            your Personal Information. This right is not absolute, and we may be
            entitled to retain and process your Personal Information despite
            your request. If you make this request, we balance certain legal,
            contractual, and business interests against your right to request
            the deletion of your Personal Information.
          </li>
          <li>
            <b>Right to object</b> to certain processing of your Personal Information.
            Upon your request, and in certain circumstances and where we are required
            to do so by law, we will limit our processing of your Personal Information
            as you request.
          </li>
          <li>
            <b>Right to not be subject to Automated Decision-Making ("ADM").</b> Trakt
            does not use ADM to provide the Services. If this changes in the future,
            we will update this posting to describe our use of ADM and your options
            to exercise your right to not be subject to ADM.
          </li>
        </ol>
        <p>
          If you are a resident of the EEA and you believe we are unlawfully
          processing your Personal Information, you also have the right to
          complain to
          <a
            href="https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm"
            target="_blank"
            rel="noopener noreferrer"
            >your local data protection supervisory authority</a
          >. If you are a resident in Switzerland, you have the right to
          complain to the
          <a
            href="https://www.edoeb.admin.ch/edoeb/en/home.html"
            target="_blank"
            rel="noopener noreferrer">Swiss data protection authorities</a
          >.
        </p>
      </ol>
    </div>

    <!-- Section 9 -->
    <div class="legal-section" id="section-9">
      <h2><span class="number">9</span>Data Security</h2>
      <p>
        Trakt employs reasonable and appropriate security procedures and
        practices to help protect your Personal Information from unauthorized or
        illegal access, destruction, use, modification, or disclosure. Trakt
        uses secure cloud servers to process and store all data, including your
        Personal Information. Access to Personal Information is limited to
        employees and contractors as needed to perform their job functions. We
        also ensure that our employees, contractors, and agents responsible for
        handling privacy inquiries are informed of applicable legal requirements
        and we restrict access to those who need that information to process it.
      </p>
      <p>
        However, no transmission of data over the Internet is 100% secure, and
        we cannot guarantee that unauthorized third parties will not defeat our
        security measures or use your Personal Information for improper
        purposes. You are responsible for maintaining the confidentiality of
        your account username and password. We encourage you to protect against
        unauthorized access to your account and device by choosing a robust
        password and signing off after each session. Trakt is not responsible
        for any lost, stolen, or compromised passwords, or for any activity on
        your account via unauthorized activity.
      </p>
    </div>

    <!-- Section 10 -->
    <div class="legal-section" id="section-10">
      <h2><span class="number">10</span>Cross-Border Data Transfers</h2>
      <p>
        Trakt is owned and operated in the United States. We use technical
        infrastructure in the United States and other jurisdictions to provide
        our Services to Trakt users wherever they are located. As such, we must
        sometimes transfer data across jurisdictional boundaries. If you use our
        Services, it is possible that your Personal Information may be
        transferred outside of your jurisdiction to the United States or other
        locations where privacy laws may not be as protective as those in your
        jurisdiction. The United States, EEA Member States, and other countries
        all have different laws. When your information is moved from your home
        country to another country, the laws and rules that protect your
        Personal Information in the country to which your information is
        transferred may be different from those in the country in which you
        live. For example, if your information is in the US, it may be accessed
        by government authorities in accordance with US law.
      </p>
      <p>
        Trakt is committed to using lawful data transfer mechanisms for all
        cross-border transfers of Personal Information. For Personal Information
        of Data Subjects transferred from the EEA to outside the EEA, Trakt
        relies on the most current Standard Contractual Clauses adopted by the
        European Commission or another appropriate legal basis for such data
        transfers, where required. To the extent that Trakt is deemed to
        transfer Personal Information outside of the EEA, we do so on the legal
        basis that such transfer is necessary to provide you with the Services
        you have chosen to use.
      </p>
      <p>
        By allowing us to collect Personal Information about you, you consent to
        the transfer and processing of your Personal Information as described in
        this section. We do not warrant that our Services are appropriate or
        authorized for use in any other jurisdictions. You are solely
        responsible for determining whether your use of our Services complies
        with applicable laws.
      </p>
    </div>

    <!-- Section 11 -->
    <div class="legal-section" id="section-11">
      <h2>
        <span class="number">11</span>Third-party Platforms and Social Media
      </h2>
      <p>
        Trakt may provide links or allow you to link to your Trakt account to
        third-party streaming services, social media, or other websites or
        platforms. These features are offered as a convenience only, and Trakt
        is not responsible for and has no ability to control the privacy and
        data collection, use, and disclosure practices of any third party. When
        you click on links that take you to external websites or platforms, you
        will be subject to their privacy policies and practices and not ours.
        Trakt encourages you to review and understand the privacy policies of
        such websites or platforms before submitting any information.
      </p>
    </div>

    <!-- Section 12 -->
    <div class="legal-section" id="section-12">
      <h2><span class="number">12</span>Changes to this Privacy Policy</h2>
      <p>
        Trakt reserves the right to amend this Privacy Policy at any time by
        updating this posting without notice and revising the last updated date.
        All changes are effective immediately when posted and apply to all
        access to and use of our Services. Your continued use of our Services
        following the posting of changes constitutes your acceptance of such
            changes.
      </p>
    </div>
</LegalPage>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .table-wrapper {
    overflow-x: auto;
    margin: 0 0 var(--gap-m) 0;
  }

  .cookies-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--ni-14);

    th,
    td {
      border: 1px solid var(--color-border);
      padding: var(--gap-xs) var(--gap-s);
      text-align: left;
      vertical-align: top;
    }

    thead tr {
      background-color: var(--color-border);

      th {
        font-weight: bold;
      }
    }

    .helper {
      display: block;
      font-size: var(--ni-12);
      color: var(--color-text-secondary);
      margin-top: 2px;
    }

    @include for-mobile {
      font-size: var(--ni-12);

      th,
      td {
        padding: var(--gap-xxs) var(--gap-xs);
      }
    }
  }
</style>
