import HandymanSuccessView from "@/views/auth/HandymanSuccessView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registration Successful | Cari Tukang",
};

export default function HandymanSuccessPage() {
  return <HandymanSuccessView />;
}
