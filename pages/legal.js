import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  createStyles,
  Box,
  Button,
  Text,
  Title,
  Center,
  Flex,
  Group,
  SegmentedControl,
  Space,
} from "@mantine/core";
import { useScrollIntoView, useWindowScroll } from "@mantine/hooks";

const useStyles = createStyles((theme) => ({
  link: {
    ...theme.fn.focusStyles(),
    display: "block",
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    lineHeight: "2.4rem",
    fontSize: theme.fontSizes.sm,
    height: "2.4rem",
    borderTopRightRadius: theme.radius.sm,
    borderBottomRightRadius: theme.radius.sm,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  linkActive: {
    fontWeight: 500,
    color:
      theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 3 : 7],
  },

  links: {
    position: "relative",
  },

  indicator: {
    transition: "transform 150ms ease",
    border: `1px solid ${
      theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 3 : 7]
    }`,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    height: "5px",
    width: "5px",
    borderRadius: "5px",
    position: "absolute",
    top: "17px",
    left: `-15px`,
  },
}));

export default function Legal({ setProfileOpened }) {
  const [linkState, setLinkState] = useState("terms");
  const [active, setActive] = useState(-99);
  const [highlighted, setHighlighted] = useState(-1);
  const [scroll, scrollTo] = useWindowScroll();
  const { classes, cx } = useStyles();
  const { scrollIntoView, targetRef } = useScrollIntoView({});

  const router = useRouter();

  const terms = [
    {
      label: "Purpose of the Website",
    },
    {
      label: "Eligibility",
    },
    {
      label: "User Accounts",
    },
    {
      label: "Content and Conduct",
    },
    {
      label: "Intellectual Property",
    },
    {
      label: "User-Generated Content and Copyright",
    },
    {
      label: "Payments, Fees, and Refunds",
    },
    {
      label: "Disclaimers and Limitation of Liability",
    },
    {
      label: "Third-Party Websites and Services",
    },
    {
      label: "Governing Law and Jurisdiction",
    },
    {
      label: "Modifications to Terms of Use",
    },
    {
      label: "Termination",
    },
    {
      label: "Severability",
    },
    {
      label: "Contact Information",
    },
  ];

  const privacy = [
    {
      label: "Information We Collect",
    },
    {
      label: "How We Use Your Information",
    },
    {
      label: "Information Sharing and Disclosure",
    },
    {
      label: "Data Retention",
    },
    {
      label: "Security",
    },
    {
      label: "Cookies and Other Tracking Technologies",
    },
    {
      label: "Third-Party Websites",
    },
  ];

  const links = linkState === "terms" ? terms : privacy;

  const items = links.map((term, index) => (
    <Box
      component="a"
      href={term.link}
      onClick={(event) => {
        event.preventDefault();
        setActive(index);
        setHighlighted(index);
        termsectionsRefs[index].current.scrollIntoView({
          behavior: "smooth",
        });
      }}
      key={index}
      className={cx(classes.link, { [classes.linkActive]: active === index })}
      sx={(theme) => ({
        cursor: "pointer",
        paddingLeft: "10px",
      })}
    >
      {term.label}
    </Box>
  ));

  const termsections = [
    {
      title: "Purpose of the Website",
      text: "Tourassist's primary objective is to provide a sophisticated platform where users can create, fund, and discover exceptional travel-related projects. Our aim is to cultivate a thriving community of individuals who are passionate about supporting distinctive travel experiences and innovative initiatives that contribute to the enrichment of the global travel industry.",
    },
    {
      title: "Eligibility",
      text: "In order to utilize our Services, you must be at least 18 years old and possess the legal capacity to enter into a binding contract with us. By accessing or using our Services, you represent and warrant that you meet these requirements and are fully competent to abide by the stipulations set forth in these Terms.",
    },
    {
      title: "User Accounts",
      text: "To create or support projects on Tourassist, you are required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to diligently update such information to maintain its accuracy, currentness, and completeness. You are responsible for safeguarding the confidentiality of your account password and are accountable for all activities that occur under your account. You agree to promptly notify us if you suspect any unauthorized use of your account or any other breach of security.",
    },
    {
      title: "Content and Conduct",
      text: (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            fontFamily: "inherit",
            fontSize: "inherit",
          }}
        >
          You bear sole responsibility for the content you post on Tourassist,
          encompassing text, images, videos, and other materials. You represent
          and warrant that you possess all necessary rights, licenses, and
          permissions to publish such content and that it does not infringe on
          any third-party rights, including copyright, trademark, or privacy
          rights.
          <br />
          <br />
          You commit to refraining from using our Services for any unlawful
          purpose or to post content that is abusive, harassing, defamatory,
          discriminatory, or otherwise harmful. We reserve the right to remove
          any content that violates these Terms or is otherwise objectionable at
          our sole discretion without prior notice.
        </pre>
      ),
    },
    {
      title: "Intellectual Property",
      text: "By submitting content to Tourassist, you grant us a non-exclusive, royalty-free, worldwide, perpetual, irrevocable, and sublicensable right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content in connection with our Services. You also agree to indemnify, defend, and hold harmless Tourassist and its affiliates, officers, agents, and employees from any claim or demand, including reasonable attorney's fees, made by any third party due to or arising out of your content, your use of our Services, or your violation of these Terms.",
    },
    {
      title: "User-Generated Content and Copyright",
      text: "We respect the intellectual property rights of others and expect our users to do the same. If you believe that your copyrighted work has been copied and posted on our Services in a way that constitutes copyright infringement, please contact us with the necessary information to evaluate and address the issue.",
    },
    {
      title: "Payments, Fees, and Refunds",
      text: (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            fontFamily: "inherit",
            fontSize: "inherit",
          }}
        >
          To support projects on Tourassist, you may be required to provide
          payment information. You agree to provide accurate, current, and
          complete information and to promptly update your information as
          necessary. We use third-party payment processors to process
          transactions, and you agree to comply with their terms and conditions.
          <br />
          <br />
          Fees may be charged for certain transactions or services, and you
          agree to pay all applicable fees. Refunds are handled on a
          case-by-case basis and are not guaranteed. Please contact us for any
          refund requests.
        </pre>
      ),
    },
    {
      title: "Disclaimers and Limitation of Liability",
      text: (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            fontFamily: "inherit",
            fontSize: "inherit",
          }}
        >
          Our Services are provided &quot;as is&quot; and without any
          warranties, express or implied. Tourassist disclaims all warranties,
          including, but not limited to, implied warranties of merchantability,
          fitness for a particular purpose, non-infringement, and title. We do
          not guarantee the accuracy, reliability, or completeness of the
          content on our platform, nor do we warrant that the Services will
          remain uninterrupted, error-free, or secure.
          <br />
          <br />
          Under no circumstances will Tourassist or its affiliates, officers,
          agents, or employees be liable for any direct, indirect, incidental,
          special, consequential, or exemplary damages, including but not
          limited to damages for loss of profits, goodwill, use, data, or other
          intangible losses, resulting from the use of or inability to use our
          Services, even if advised of the possibility of such damages.
        </pre>
      ),
    },
    {
      title: "Third-Party Websites and Services",
      text: "Our Services may contain links to third-party websites or services that are not owned or controlled by Tourassist. We do not endorse, assume responsibility for, or warrant the accuracy or reliability of any content, product, or service available through these third-party websites or services. Your use of and reliance on any third-party websites or services is solely at your own risk.",
    },
    {
      title: "Governing Law and Jurisdiction",
      text: "These Terms of Use shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of our Services shall be resolved in the courts of [Your Jurisdiction].",
    },
    {
      title: "Modifications to Terms of Use",
      text: "We reserve the right to update and change these Terms of Use at any time, without prior notice. We will notify users of significant changes, and users are responsible for reviewing the updated terms. Your continued use of our Services following any modifications to the Terms of Use constitutes your acceptance of the revised terms.",
    },
    {
      title: "Termination",
      text: "We reserve the right to terminate your access to and use of our Services, at our sole discretion, without prior notice or liability, for any reason or no reason, including but not limited to a breach of these Terms. All provisions of these Terms that by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.",
    },
    {
      title: "Severability",
      text: "In the event that any provision of these Terms is deemed invalid, illegal, or unenforceable for any reason, such provision shall be deemed severed from the remaining terms, and the remaining provisions shall continue in full force and effect.",
    },
    {
      title: "Contact Information",
      text: (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            fontFamily: "inherit",
            fontSize: "inherit",
          }}
        >
          If you have any questions, concerns, or comments regarding these Terms
          of Use, please do not hesitate to contact us at [Your Contact
          Information].
          <br />
          <br />
          Please note that this document is intended to serve as a starting
          point and should not be considered legal advice. Consult with an
          attorney to review and tailor these terms to your specific needs and
          to ensure full legal compliance.
        </pre>
      ),
    },
  ];

  const termsectionsRefs = termsections.map(() => React.createRef());

  const privsections = [
    {
      title: "Information We Collect",
      text: (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            fontFamily: "inherit",
            fontSize: "inherit",
          }}
        >
          We collect personal information to provide and improve our Services.
          The types of information we may collect include:
          <ol type="a">
            <li>
              Account Information: When you register for an account, we collect
              your name, email address, password, and other relevant
              information.
            </li>
            <li>
              Payment Information: To process transactions, we may require your
              payment information, such as your credit card number, billing
              address, and related details.
            </li>
            <li>
              User-Generated Content: We collect information that you post on
              our platform, such as project descriptions, images, videos, and
              comments.
            </li>
            <li>
              Communication Data: When you contact us or communicate with other
              users, we may collect and store information from those
              interactions.
            </li>
            <li>
              Usage Data: We may collect data about your usage of our Services,
              including access times, pages viewed, and the website you visited
              before navigating to our Services.
            </li>
            <li>
              Device and Technical Information: We may collect information about
              the device and software you use to access our Services, such as
              your IP address, browser type, operating system, and other related
              information.
            </li>
          </ol>
        </pre>
      ),
    },
    {
      title: "How We Use Your Information",
      text: (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            fontFamily: "inherit",
            fontSize: "inherit",
          }}
        >
          We use your personal information for various purposes, including:
          <ol type="a">
            <li>Providing and improving our Services;</li>
            <li>Processing transactions and sending related information;</li>
            <li>
              Personalizing your experience and delivering content relevant to
              your interests;
            </li>
            <li>
              Communicating with you about our Services, promotions, and events;
            </li>
            <li>
              Responding to your inquiries and providing customer support;
            </li>
            <li>
              Monitoring and analyzing trends, usage, and activities in
              connection with our Services;
            </li>
            <li>
              Detecting, preventing, and addressing fraud, security breaches,
              and other potential risks;
            </li>
            <li>
              Enforcing our Terms of Use and complying with legal obligations.
            </li>
          </ol>
        </pre>
      ),
    },
    {
      title: "Information Sharing and Disclosure",
      text: (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            fontFamily: "inherit",
            fontSize: "inherit",
          }}
        >
          We may share your personal information with third parties under
          certain circumstances:
          <ol type="a">
            <li>
              Service Providers: We may share your information with third-party
              vendors, consultants, and other service providers who perform
              services on our behalf.
            </li>
            <li>
              Payment Processors: We use third-party payment processors to
              process transactions, and your payment information may be shared
              with these processors to facilitate payments.
            </li>
            <li>
              Legal Compliance: We may disclose your information if required to
              do so by law, in response to a court order, subpoena, or other
              legal request.
            </li>
            <li>
              Business Transfers: In the event of a merger, acquisition,
              reorganization, or sale of assets, we may transfer your
              information to the acquiring party or another entity involved in
              the transaction.
            </li>
            <li>
              Consent: We may share your information with your consent or at
              your direction.
            </li>
          </ol>
        </pre>
      ),
    },
    {
      title: "Data Retention",
      text: "We retain your personal information for as long as necessary to fulfill the purposes for which it was collected, comply with our legal obligations, resolve disputes, and enforce our agreements.",
    },
    {
      title: "Security",
      text: "We implement reasonable administrative, technical, and physical safeguards to protect your personal information from unauthorized access, disclosure, or loss. However, no method of transmission or storage is completely secure, and we cannot guarantee the absolute security of your information.",
    },
    {
      title: "Cookies and Other Tracking Technologies",
      text: "We may use cookies, web beacons, and other tracking technologies to collect and store information about your use of our Services. These technologies help us analyze usage patterns, personalize your experience, and improve the overall quality of our Services.",
    },
    {
      title: "Third-Party Websites",
      text: "Our Services may contain links to third-party websites. We are not responsible for the privacy practices or the content of these websites. Please review the privacy policies",
    },
  ];

  const sections = linkState === "terms" ? termsections : privsections;

  const content = sections.map((section, index) => (
    <Box pt={20} mb={10} key={index} ref={termsectionsRefs[index]}>
      <Title order={4} color={highlighted === index ? "blue.4" : "inherit"}>
        {section.title}
      </Title>
      <Text fz={14} mt={10}>
        {section.text}
      </Text>
    </Box>
  ));

  return (
    <>
      <Center mt={120} mb={50}>
        <Flex w={"80%"} maw={1200}>
          <Flex direction={"column"} miw={"300px"} pos={"fixed"} top={205}>
            <SegmentedControl
              value={linkState}
              onChange={setLinkState}
              onClick={() => {
                setActive(-99);
                setHighlighted(-1);
                scrollTo({ y: 0 });
              }}
              ml={-60}
              sx={{
                transform: "scale(.75)",
              }}
              data={[
                { label: "Terms of Use", value: "terms" },
                { label: "Privacy Policy", value: "privacy" },
              ]}
            />
            <Box className={classes.links}>
              <Box
                className={classes.indicator}
                style={{
                  transform: `translateY(calc(${active} * 2.4rem))`,
                }}
              />
              {items}
            </Box>
          </Flex>
          <Space w={"30%"} />
          <Flex direction={"column"} w={"70%"}>
            <Title fz={50}>
              {linkState === "terms" ? "Terms of Use" : "Privacy Policy"}
            </Title>
            <Text fz={10} w={"100%"} ta={"right"}>
              Last Updated: April 30, 2023
            </Text>
            <Box
              radius={3}
              bg={"rgba(0,0,0,0.05)"}
              w={"100%"}
              mt={10}
              py={10}
              px={20}
              sx={{
                border: "1px solid rgba(0,0,0,0.15)",
                boxShadow: "0 7px 10px 0 rgba(0,0,0,0.05)",
              }}
            >
              <Group spacing={30}>
                <Text w={"80%"} fz={12}>
                  {linkState === "terms"
                    ? `Welcome to Tourassist, a premier crowdfunding platform
                  dedicated to travel-related projects. These Terms of Use
                  ("Terms") govern your access to and use of our
                  website, applications, products, and services (collectively
                  referred to as "Services"). Please read these Terms
                  carefully before using our Services. By accessing or using the
                  Services, you agree to be bound by these Terms and our Privacy
                  Policy. If you do not agree to these Terms, please do not use
                  our Services.`
                    : `At Tourassist, we are committed to protecting the privacy and security of our users. This Privacy Policy ("Policy") explains how we collect, use, and disclose your personal information when you access or use our website, products, and services (collectively referred to as "Services"). By using our Services, you acknowledge your acceptance of this Policy.`}
                </Text>
                <Box w={"calc(20% - 30px)"}>
                  {" "}
                  <Button.Group orientation="vertical">
                    <Button
                      variant="light"
                      compact
                      fz={10}
                      onClick={() => {
                        router.push("/help");
                      }}
                    >
                      About Tourassist
                    </Button>
                    <Button
                      variant="light"
                      compact
                      fz={10}
                      onClick={() => {
                        router.push("/contact");
                      }}
                    >
                      Contact Us
                    </Button>
                  </Button.Group>
                </Box>
              </Group>
            </Box>
            <Box px={20}>{content}</Box>
          </Flex>
        </Flex>
      </Center>
    </>
  );
}
