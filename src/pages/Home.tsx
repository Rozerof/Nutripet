import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { dailyTargets } from '../lib/calc'
import Mascot from '../components/Mascot'

export default function Home() {
  const profile = useLiveQuery(() => db.profile.get(1))
  const pet = useLiveQuery(() => db.pet.get(1))
  if (!profile || !pet) return null
  const t = dailyTargets(profile)

  return (
    <main className="mx-auto max-w-md px-5 py-8 text-center">
      <Mascot size={140} />
      <h1 className="mt-4 font-display text-3xl font-semibold">
        Hola, {profile.name}
      </h1>
      <p className="mt-2 text-ink/70">
        {pet.name} y tú empiezan hoy. Tu meta es de {t.kcal} kcal.
      </p>
    </main>
  )
}