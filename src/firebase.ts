import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GroupRaces, MiniLeagueConfig, Round } from "./kings";
//import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDlXiU-m-CqadoYPnTVcVEeaQJ40RDGNg4",
  authDomain: "kings-results-manager.firebaseapp.com",
  projectId: "kings-results-manager",
  storageBucket: "kings-results-manager.firebasestorage.app",
  messagingSenderId: "576429513460",
  appId: "1:576429513460:web:d410a8a1422cb111d21ca1",
  measurementId: "G-GHRG15FKF2"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const serde = {
  toFirestoreRound: (round: Round) => {
    Object.values(round.config).forEach(c => {
      // @ts-expect-error readonly field error while not properly implemented
      c.stage1.forEach(s => s.template.races = s.template.races.reduce((acc, r, i) => {
        acc[i] = r
        return acc
      }, {}))
      // @ts-expect-error readonly field error while not properly implemented
      c.stage2?.forEach(s => s.template.races = s.template.races.reduce((acc, r, i) => {
        acc[i] = r
        return acc
      }, {}))
      // @ts-expect-error readonly field error while not properly implemented
      c.knockout?.forEach(s => s.template.races = s.template.races.reduce((acc, r, i) => {
        acc[i] = r
        return acc
      }, {}))
    })
    Object.values(round.races.stage1).forEach(div => Object.values(div).forEach(group => {
      // @ts-expect-error readonly field error while not properly implemented
      group.results = group.results?.reduce((acc, r, i) => {
        acc[i] = r
        return acc
      }, {}) || {}
    }))
    Object.values(round.races.stage2 || {}).forEach(div => Object.values(div).forEach(group => {
      // @ts-expect-error readonly field error while not properly implemented
      group.results = group.results?.reduce((acc, r, i) => {
        acc[i] = r
        return acc
      }, {}) || {}
    }))
    Object.values(round.races.knockout || {}).forEach(div => Object.values(div).forEach(group => {
      // @ts-expect-error readonly field error while not properly implemented
      group.results = group.results?.reduce((acc, r, i) => {
        acc[i] = r
        return acc
      }, {}) || {}
    }))
    // @ts-expect-error readonly field error while not properly implemented
    round.details.date = round.details.date.toISOString()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return round as any
  },
  fromFirestoreRound: (round: Round) => {
    const convert = <T>(races: Record<number, T>): T[] => {
      return Object.entries(races).sort(([indexA], [indexB]) => +indexA - +indexB).map(([, r]) => r)
    }
    const convertAndSetTemplates = (c: MiniLeagueConfig) => {
      type V = (typeof c.template.races)[number]
      // @ts-expect-error readonly field error while not properly implemented
      c.template.races = convert(c.template.races as unknown as Record<number, V>)
    }
    Object.values(round.config).forEach(c => {
      c.stage1.forEach(convertAndSetTemplates)
      c.stage2?.forEach(convertAndSetTemplates)
      c.knockout?.forEach(convertAndSetTemplates)
    })
    const convertAndSetGroupRaces = (r: GroupRaces) => {
      type V = (typeof r.results)[number]
      r.results = convert(r.results as unknown as Record<number, V>)
    }
    Object.values(round.races.stage1).forEach(div => Object.values(div).forEach(convertAndSetGroupRaces))
    Object.values(round.races.stage2 || {}).forEach(div => Object.values(div).forEach(convertAndSetGroupRaces))
    Object.values(round.races.knockout || {}).forEach(div => Object.values(div).forEach(convertAndSetGroupRaces))
    round.details.date = new Date(round.details.date)
    return round
  },
}

export default app
