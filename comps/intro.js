import { useRecoilState } from "recoil";
import { Center, Box, Title, Text, Button } from "@mantine/core";
import { visibleState } from "../pages/index";

export default function Intro() {
  // const visible = useRecoilValue(visibleState);
  const [visible, setVisible] = useRecoilState(visibleState);

  return (
    <>
      {!visible && (
        <Center
          sx={{
            position: "absolute",
            height: "100vh",
            width: "100%",
            flexWrap: "wrap",
            zIndex: "105",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              width: "70%",
            }}
          >
            <Title
              order={1}
              sx={{ fontSize: "6rem", marginBottom: "30px", lineHeight: "1" }}
            >
              Where in the{" "}
              <Text
                inherit
                span
                variant="gradient"
                fw={900}
                gradient={{ from: "#00E8FC", to: "#102E4A", deg: 45 }}
              >
                world
              </Text>{" "}
              would you like to go?
            </Title>
            <Text size="md" sx={{ width: "90%", marginLeft: "5%" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Text>
            <Box sx={{ marginTop: "30px" }}>
              <Button
                size="md"
                uppercase={true}
                variant="default"
                sx={{ width: "200px", marginRight: "20px" }}
              >
                Login | Sign Up
              </Button>
              <Button
                size="md"
                uppercase={true}
                variant="filled"
                sx={{ width: "200px" }}
                onClick={() => setVisible((v) => !v)}
              >
                Plan a trip
              </Button>
            </Box>
          </Box>
        </Center>
      )}
    </>
  );
}
