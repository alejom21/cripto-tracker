import Image from "next/image";
import styles from "./page.module.css";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <main>
      <Header />
      <SearchBar />
    </main>
  )
};
