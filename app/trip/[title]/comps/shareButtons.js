import { Button, Center, Tooltip } from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandTwitter,
  IconBrandWhatsapp,
  IconQrcode,
  IconSourceCode,
} from "@tabler/icons-react";
import {} from "react";
import classes from "../styles/shareButtons.module.css";

export default function ShareButtons() {
  return (
    <Center>
      <Button.Group className={classes.shareButtonGroup}>
        <Tooltip classNames={{ tooltip: "toolTip" }} label="Share on Facebook">
          <Button
            className={classes.shareButton}
            size="lg"
            w={"15%"}
            variant="transparent"
          >
            <IconBrandFacebook size={20} />
          </Button>
        </Tooltip>
        <Tooltip classNames={{ tooltip: "toolTip" }} label="Share on Instagram">
          <Button
            className={classes.shareButton}
            size="lg"
            w={"15%"}
            variant="transparent"
          >
            <IconBrandInstagram size={20} />
          </Button>
        </Tooltip>
        <Tooltip classNames={{ tooltip: "toolTip" }} label="Share on Tiktok">
          <Button
            className={classes.shareButton}
            size="lg"
            w={"15%"}
            variant="transparent"
          >
            <IconBrandTiktok size={20} />
          </Button>
        </Tooltip>
        <Tooltip classNames={{ tooltip: "toolTip" }} label="Share on Twitter">
          <Button
            className={classes.shareButton}
            size="lg"
            w={"15%"}
            variant="transparent"
          >
            <IconBrandTwitter size={20} />
          </Button>
        </Tooltip>
        <Tooltip classNames={{ tooltip: "toolTip" }} label="Share on Whatsapp">
          <Button
            className={classes.shareButton}
            size="lg"
            w={"15%"}
            variant="transparent"
          >
            <IconBrandWhatsapp size={20} />
          </Button>
        </Tooltip>
        <Tooltip classNames={{ tooltip: "toolTip" }} label="HTML Embed Code">
          <Button
            className={classes.shareButton}
            size="lg"
            w={"15%"}
            variant="transparent"
          >
            <IconSourceCode size={20} />
          </Button>
        </Tooltip>
        <Tooltip classNames={{ tooltip: "toolTip" }} label="Share with QR Code">
          <Button
            className={classes.shareButton}
            size="lg"
            w={"15%"}
            variant="transparent"
          >
            <IconQrcode size={20} />
          </Button>
        </Tooltip>
      </Button.Group>
    </Center>
  );
}
