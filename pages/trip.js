import { useRef } from "react";
import { Box, Center, Group, Flex, Image } from "@mantine/core";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

export default function Trip() {
  const ref = useRef(null);

  return (
    <Center>
      <Group spacing={30} w={"80%"} maw={1200} mt={100}>
        <Flex w={"calc(60% - 30px)"}>
          <Carousel showArrows={true}>
            <div>
              <Image src="img/women.jpg" alt="" />
            </div>
            <div>
              <Image src="img/women_blue.jpg" alt="" />
            </div>
          </Carousel>
        </Flex>
        <Flex w={"40%"} bg={"red"}>
          2
        </Flex>
      </Group>
    </Center>
  );
}
