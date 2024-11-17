import { Typography } from "@suid/material";
import Link from "../components/Link";

export default function RaceManagerRoot() {
  return (
    <div>
      <Link href="round1">
        <Typography>
          Round 1
        </Typography>
      </Link>
      <Link href="round2">
        <Typography>
          Round 2
        </Typography>
      </Link>
    </div>
  )
}

