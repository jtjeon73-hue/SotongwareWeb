import { LocalizedHomePage } from "@/components/home/hub/LocalizedHomePage";

/** Root path serves Korean home for backward compatibility; /ko and /en are canonical locale routes. */
export default function HomePage() {
  return <LocalizedHomePage locale="ko" />;
}
