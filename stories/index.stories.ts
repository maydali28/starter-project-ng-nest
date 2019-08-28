import { storiesOf } from "@storybook/angular";
import { Welcome, Button } from "@storybook/angular/demo";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

storiesOf("Button", module)
  .add("Button", () => ({
    component: Button,
    props: {
      text: "Hello Button 1"
    }
  }))
  .add("with text", () => ({
    component: Button,
    props: {
      text: "Hello Button"
    }
  }))
  .add(
    "with some emoji",
    () => ({
      component: Button,
      props: {
        text: "😀 😎 👍 💯"
      }
    }),
    { notes: "My notes on a button with emojis" }
  )
  .add(
    "with some emoji and action",
    () => ({
      component: Button,
      props: {
        text: "😀 😎 👍 💯",
        onClick: action("This was clicked OMG")
      }
    }),
    { notes: "My notes on a button with emojis" }
  );

storiesOf("Another Button", module).add(
  "button with link to another story",
  () => ({
    component: Button,
    props: {
      text: "Go to Welcome Story",
      onClick: linkTo("Welcome")
    }
  })
);
