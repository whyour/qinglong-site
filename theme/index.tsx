import Theme from "rspress/theme";
import { HomeLayout as BasicHomeLayout } from "rspress/theme";
import "./index.css";

function HomeLayout() {
  return <BasicHomeLayout />;
}

const Layout = () => {
  return <Theme.Layout />;
};

export default {
  ...Theme,
  Layout,
  HomeLayout,
};

export * from "rspress/theme";
