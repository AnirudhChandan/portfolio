import Feather from "@/components/Feather";
import FooterPeacock from "@/components/FooterPeacock";
import HomePage from "@/components/HomePage";

export default function Home() {
  return <HomePage feather={<Feather />} peacock={<FooterPeacock />} />;
}
