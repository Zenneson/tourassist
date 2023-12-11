"use client";
import {
  Box,
  Center,
  Title,
  TextInput,
  Textarea,
  SimpleGrid,
  Group,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";

export default function Contact() {
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    validate: {
      name: (value) => value.trim().length < 2,
      email: (value) => !/^\S+@\S+$/.test(value),
      subject: (value) => value.trim().length === 0,
    },
  });

  return (
    <Center>
      <Box mt={120} w={"50%"}>
        <form onSubmit={form.onSubmit(() => {})}>
          <Title fz={50} ta={"center"}>
            Contact Us
          </Title>
          <SimpleGrid
            cols={2}
            mt="xl"
            breakpoints={[{ maxWidth: "sm", cols: 1 }]}
          >
            <TextInput
              label="Name"
              placeholder="Your name"
              name="name"
              variant="filled"
              {...form.getInputProps("name")}
            />
            <TextInput
              label="Email"
              placeholder="Your email"
              name="email"
              variant="filled"
              {...form.getInputProps("email")}
            />
          </SimpleGrid>

          <TextInput
            label="Subject"
            placeholder="Subject"
            mt="md"
            name="subject"
            variant="filled"
            {...form.getInputProps("subject")}
          />
          <Textarea
            mt="md"
            label="Message"
            placeholder="Your message"
            maxRows={10}
            minRows={5}
            autosize
            name="message"
            variant="filled"
            {...form.getInputProps("message")}
          />

          <Group justify="flex-end" mt="xl">
            <Button type="submit" size="sm" px={40} variant="outline">
              <Title order={3}>SEND</Title>
            </Button>
          </Group>
        </form>
      </Box>
    </Center>
  );
}
