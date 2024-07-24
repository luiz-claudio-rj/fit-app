import { TabsNavigation } from "@/app/logged/_layout";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends TabsNavigation {}
  }
}
