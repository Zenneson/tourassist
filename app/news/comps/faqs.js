"use client";
import { Accordion, Group, Stack, Title } from "@mantine/core";
import { IconListCheck } from "@tabler/icons-react";
import classes from "../styles/faqs.module.css";

export default function Faqs() {
  const questions = [
    {
      question: "What is Tourassist?",
      value: "1",
      answer:
        "Tourassist is a crowdfunding platform dedicated to travel-related projects. Our primary objective is to provide a sophisticated platform where users can create, fund, and discover exceptional travel-related projects and initiatives.",
    },
    {
      question: "How long does it take to complete the assessment?",
      value: "2",
      answer:
        "Tourassist is a crowdfunding platform dedicated to travel-related projects. Our primary objective is to provide a sophisticated platform where users can create, fund, and discover exceptional travel-related projects and initiatives.",
    },
    {
      question: "How do I create a project on Tourassist?",
      value: "3",
      answer: `Once you have registered and logged into your account, click the "Create a Project" button and follow the step-by-step process to provide details about your project, including its title, description, funding goal, and duration.`,
    },
    {
      question: "How do I support a project on Tourassist?",
      value: "4",
      answer: `To support a project, visit the project's page and click the "Back this Project" button. Select the desired reward tier, enter your payment information, and confirm your pledge.`,
    },
    {
      question: "How are funds transferred to project creators?",
      value: "5",
      answer:
        "When a project reaches its funding goal and the campaign ends, Tourassist transfers the collected funds to the project creator, minus any applicable fees, using the payment information provided during project setup.",
    },
    {
      question: "Are there fees associated with using Tourassist?",
      value: "6",
      answer:
        "Yes, Tourassist charges a platform fee for successfully funded projects. Additional fees may be charged by third-party payment processors. Please refer to our Terms of Use for more information on fees.",
    },
    {
      question: "Can I get a refund for a project I supported?",
      value: "7",
      answer:
        "Refunds are handled on a case-by-case basis and are not guaranteed. Please contact us if you have any refund requests, and we will do our best to address your concerns.",
    },
    {
      question:
        "How do I report a project or user that violates the Terms of Use?",
      value: "8",
      answer:
        "If you come across a project or user that violates our Terms of Use, please contact us with details about the issue. We will review the report and take appropriate action.",
    },
    {
      question:
        "How does Tourassist protect my privacy and personal information?",
      value: "9",
      answer:
        "We take your privacy seriously and implement reasonable administrative, technical, and physical safeguards to protect your personal information. Please refer to our Privacy Policy for more information on how we collect, use, and disclose your information.",
    },
    {
      question: "How can I contact Tourassist for further assistance?",
      value: "10",
      answer:
        "If you have any questions, concerns, or comments, please do not hesitate to contact us at [Your Contact Information]. Our support team will be happy to help you with any inquiries you may have.",
    },
  ];

  const faq = questions.map((question, index) => (
    <Accordion.Item key={index} value={question.value}>
      <Accordion.Control>{question.question}</Accordion.Control>
      <Accordion.Panel>{question.answer}</Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <>
      <Stack align="center" justify="flex-start" w={"100%"} h={"100vh"}>
        <Group
          w={"100%"}
          justify="flex-start"
          gap={10}
          pl={10}
          className={classes.faqFrame}
        >
          <IconListCheck opacity={0.1} size={40} stroke={1} />
          <Title opacity={0.3} order={3}>
            Frequently Asked Questions
          </Title>
        </Group>
        <Accordion
          variant="separated"
          w={"50vw"}
          classNames={{
            item: classes.accordionTitle,
            content: classes.accordionContent,
          }}
        >
          {faq}
        </Accordion>
      </Stack>
    </>
  );
}
