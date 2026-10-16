import { Round } from "../kings"
import { db, serde } from "../firebase";
import { setDoc, doc, collection, query, where, getDocsFromServer, getDoc } from "firebase/firestore";
import { getEnv } from "../utils/envutils";

const env = getEnv()

const refpathRounds = `${env}-rounds`
const refpathUsers = `${env}-users`

export async function uploadRound(round: Round, owner: string) {
  if (!round.id) {
    throw new Error("Round must have an id")
  }

  if (!owner) {
    throw new Error("User is not logged in and fully authenticated")
  }

  if (owner !== round.owner && round.owner !== "local") {
    throw new Error("Cannot update rounds you do not own")
  }

  // TODO use built in support for converters in firestore
  const fsRound = serde.toFirestoreRound(round)
  const payload = {
    ...fsRound,
    owner,
  }

  const ref = doc(db, refpathRounds, round.id)
  await setDoc(ref, payload)
}

export async function getRounds(league: string) {
  const roundsRef = collection(db, refpathRounds)
  const q = query(roundsRef, where("league", "==", league))
  const rounds = await getDocsFromServer(q)
  // FIXME detect dups
  return rounds.docs
    .map(doc => doc.data())
    .map(d => serde.fromFirestoreRound(d as unknown as Round))
}

export async function saveUser(userinfo: {
  owner: string;
  username: string;
  fullName: string;
  firstName: string;
  lastName: string;
  roles: string[];
}) {
  if (!userinfo.owner) {
    throw new Error("User must have an owner id")
  }

  const ref = doc(db, refpathUsers, userinfo.owner)

  await setDoc(ref, userinfo)
}

export async function getUser(id: string) {
  const userRef = doc(db, refpathUsers, id)
  const user = await getDoc(userRef)
  if (user.exists()) {
    return user.data()
  }
  return null
}
