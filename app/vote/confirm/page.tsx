import { redirect } from "next/navigation";
import { getCurrentVoter } from "../../../lib/auth";
import VoteConfirmClient from "./VoteConfirmClient";

export default async function VoteConfirmPage() {
  const voter = await getCurrentVoter();

  if (!voter) {
    redirect("/login");
  }

  if (voter.hasVoted) {
    redirect("/vote/success");
  }

  return <VoteConfirmClient />;
}