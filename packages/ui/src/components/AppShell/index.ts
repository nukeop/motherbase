import { AppShellRoot } from "./AppShell";
import { Main } from "./Main";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

type AppShellComponent = typeof AppShellRoot & {
  TopBar: typeof TopBar;
  Sidebar: typeof Sidebar;
  Main: typeof Main;
};

export const AppShell = AppShellRoot as AppShellComponent;
AppShell.TopBar = TopBar;
AppShell.Sidebar = Sidebar;
AppShell.Main = Main;
