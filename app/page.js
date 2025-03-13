import Link from "next/link";
import Navigation from "./_components/navigation";


export default function Page() {
  return (
    <div>
      <h1>The Wild Oasis - Welcome to the Paradise</h1>

      <Link href="/cabins">Explore Luxury Cabins</Link>
    </div>
  );
}
