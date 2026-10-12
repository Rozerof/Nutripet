import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db, type Profile } from '../db'
import { dailyTargets } from '../lib/calc'
import Mascot from '../components/Mascot'

type Sex = Profile['sex']
type Activity = Profile['activity']
type Goal = Profile['goal']

const ACTIVITY: { value: Activity; label: string; hint: string }[] = [
  { value: 1.2, label: 'Poco movimiento', hint: 'Paso mucho tiempo sentado/a, casi sin ejercicio' },
  { value: 1.375, label: 'Algo activo/a', hint: 'Ejercicio ligero 1 a 3 días por semana' },
  { value: 1.55, label: 'Activo/a', hint: 'Ejercicio 3 a 5 días por semana' },
  { value: 1.725, label: 'Muy activo/a', hint: 'Ejercicio intenso casi todos los días' },
]

const GOALS: { value: Goal; label: string; hint: string }[] = [
  { value: 'lose', label: 'Bajar de peso con calma', hint: 'Un déficit moderado, sin extremos' },
  { value: 'maintain', label: 'Mantener mi peso', hint: 'Cuidar mis hábitos y mi energía' },
  { value: 'gain', label: 'Ganar fuerza y peso', hint: 'Un aumento suave junto con ejercicio' },
]

const LIMITS = [
  { id: 'rodilla', label: 'Rodillas' },
  { id: 'espalda_baja', label: 'Espalda baja' },
  { id: 'hombro', label: 'Hombros' },
  { id: 'muneca', label: 'Muñecas' },
  { id: 'tobillo', label: 'Tobillos' },
  { id: 'cadera', label: 'Cadera' },
  { id: 'cuello', label: 'Cuello' },
]

const SAYS = [
  '¡Hola! Vamos a conocernos.',
  '¡Quiero un nombre!',
  'Con esto calculo cuánta energía necesitas.',
  'Casi listo, ya mismo lo tenemos.',
  'Cuéntame cómo es tu semana.',
  'Elige un ritmo que puedas sostener.',
  'Cuidaré que ningún ejercicio te lastime.',
  '¡Tu plan está listo!',
]

const TOTAL = 7 // pasos de preguntas; el paso 7 es el resumen
const THIS_YEAR = new Date().getFullYear()

const focus =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink'
const inputCls =
  'w-full rounded-2xl border-2 border-line bg-white px-4 py-3 text-lg outline-none focus:border-leaf'

function Choice(props: {
  selected: boolean
  onClick: () => void
  title: string
  hint?: string
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      aria-pressed={props.selected}
      className={`w-full rounded-2xl border-2 px-4 py-3 text-left transition ${focus} ${
        props.selected
          ? 'border-leaf bg-white shadow-sm'
          : 'border-line bg-white/60 hover:border-leaf/60'
      }`}
    >
      <span className="block font-bold">{props.title}</span>
      {props.hint && (
        <span className="block text-sm text-ink/70">{props.hint}</span>
      )}
    </button>
  )
}

function Field(props: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  numeric?: boolean
  suffix?: string
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold">{props.label}</span>
      <div className="relative">
        <input
          className={inputCls}
          value={props.value}
          placeholder={props.placeholder}
          inputMode={props.numeric ? 'numeric' : 'text'}
          onChange={(e) => props.onChange(e.target.value)}
        />
        {props.suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/60">
            {props.suffix}
          </span>
        )}
      </div>
    </label>
  )
}

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [petName, setPetName] = useState('')
  const [sex, setSex] = useState<Sex | null>(null)
  const [birthYear, setBirthYear] = useState('')
  const [heightCm, setHeightCm] = useState('')
  const [weightKg, setWeightKg] = useState('')
  const [activity, setActivity] = useState<Activity | null>(null)
  const [goal, setGoal] = useState<Goal | null>(null)
  const [limitations, setLimitations] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const by = Number(birthYear)
  const h = Number(heightCm)
  const w = Number(weightKg)
  const ageOk = by >= THIS_YEAR - 90 && by <= THIS_YEAR - 18

  const valid =
    [
      name.trim().length > 0,
      petName.trim().length > 0,
      sex !== null && ageOk,
      h >= 120 && h <= 230 && w >= 35 && w <= 250,
      activity !== null,
      goal !== null,
      true,
    ][step] ?? true

  const profile: Profile | null =
    sex && activity && goal
      ? {
          id: 1,
          name: name.trim(),
          sex,
          birthYear: by,
          heightCm: h,
          weightKg: w,
          activity,
          goal,
          limitations,
        }
      : null

  const targets = profile && step === TOTAL ? dailyTargets(profile) : null

  function toggleLimit(id: string) {
    setLimitations((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  async function finish() {
    if (!profile) return
    setSaving(true)
    await db.profile.put(profile)
    await db.pet.put({
      id: 1,
      name: petName.trim(),
      stage: 1,
      energy: 0,
      totalHabits: 0,
    })
    navigate('/')
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-5 pb-6 pt-5">
      <div
        className="h-2 rounded-full bg-line"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={TOTAL}
        aria-valuenow={step}
      >
        <div
          className="h-2 rounded-full bg-leaf transition-all duration-300"
          style={{ width: `${(step / TOTAL) * 100}%` }}
        />
      </div>

      <div className="flex items-center gap-3 py-5">
        <Mascot size={88} mood={step === TOTAL ? 'cheer' : 'hello'} />
        <p className="rounded-2xl rounded-bl-sm bg-white px-4 py-3 font-semibold shadow-sm">
          {SAYS[step]}
        </p>
      </div>

      <div className="flex-1 space-y-4">
        {step === 0 && (
          <>
            <h1 className="font-display text-3xl font-semibold">
              ¿Cómo te llamas?
            </h1>
            <Field label="Tu nombre" value={name} onChange={setName} placeholder="Roz" />
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="font-display text-3xl font-semibold">
              Ponle nombre a tu compañero
            </h1>
            <p className="text-ink/70">
              Va a crecer y cambiar contigo, a medida que cuides tus hábitos.
            </p>
            <Field label="Nombre de tu mascota" value={petName} onChange={setPetName} />
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="font-display text-3xl font-semibold">Sobre ti</h1>
            <p className="text-ink/70">
              Estos datos solo sirven para calcular cuánta energía gasta tu cuerpo.
              Esta versión es para mayores de 18 años.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Choice selected={sex === 'F'} onClick={() => setSex('F')} title="Mujer" />
              <Choice selected={sex === 'M'} onClick={() => setSex('M')} title="Hombre" />
            </div>
            <Field
              label="Año de nacimiento"
              value={birthYear}
              onChange={setBirthYear}
              placeholder="2000"
              numeric
            />
            {birthYear.length === 4 && !ageOk && (
              <p className="text-sm text-red-700">
                Escribe un año entre {THIS_YEAR - 90} y {THIS_YEAR - 18}.
              </p>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="font-display text-3xl font-semibold">Tu cuerpo hoy</h1>
            <p className="text-ink/70">
              Es tu punto de partida, nada más. Puedes actualizarlo cuando quieras.
            </p>
            <Field label="Estatura" value={heightCm} onChange={setHeightCm} suffix="cm" numeric />
            <Field label="Peso" value={weightKg} onChange={setWeightKg} suffix="kg" numeric />
          </>
        )}

        {step === 4 && (
          <>
            <h1 className="font-display text-3xl font-semibold">
              ¿Qué tan activo/a eres?
            </h1>
            {ACTIVITY.map((a) => (
              <Choice
                key={a.value}
                selected={activity === a.value}
                onClick={() => setActivity(a.value)}
                title={a.label}
                hint={a.hint}
              />
            ))}
          </>
        )}

        {step === 5 && (
          <>
            <h1 className="font-display text-3xl font-semibold">
              ¿Qué quieres lograr?
            </h1>
            {GOALS.map((g) => (
              <Choice
                key={g.value}
                selected={goal === g.value}
                onClick={() => setGoal(g.value)}
                title={g.label}
                hint={g.hint}
              />
            ))}
          </>
        )}

        {step === 6 && (
          <>
            <h1 className="font-display text-3xl font-semibold">
              ¿Algo te molesta al moverte?
            </h1>
            <p className="text-ink/70">
              Marca las zonas que prefieres no cargar y no te propondré ejercicios
              que las exijan.
            </p>
            <div className="flex flex-wrap gap-2">
              {LIMITS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  aria-pressed={limitations.includes(l.id)}
                  onClick={() => toggleLimit(l.id)}
                  className={`rounded-full border-2 px-4 py-2 font-semibold transition ${focus} ${
                    limitations.includes(l.id)
                      ? 'border-leaf bg-leaf text-white'
                      : 'border-line bg-white'
                  }`}
                >
                  {l.label}
                </button>
              ))}
              <button
                type="button"
                aria-pressed={limitations.length === 0}
                onClick={() => setLimitations([])}
                className={`rounded-full border-2 px-4 py-2 font-semibold transition ${focus} ${
                  limitations.length === 0
                    ? 'border-leaf bg-leaf text-white'
                    : 'border-line bg-white'
                }`}
              >
                Ninguna
              </button>
            </div>
          </>
        )}

        {step === TOTAL && targets && (
          <>
            <h1 className="font-display text-3xl font-semibold">
              Listo, {name.trim()}
            </h1>
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-ink/70">Tu meta diaria</p>
              <p className="font-display text-4xl font-semibold text-leaf-dark">
                {targets.kcal} kcal
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-mint p-3">
                  <p className="font-bold">{targets.protein} g</p>
                  <p className="text-sm text-ink/70">Proteína</p>
                </div>
                <div className="rounded-2xl bg-mint p-3">
                  <p className="font-bold">{targets.carbs} g</p>
                  <p className="text-sm text-ink/70">Carbohidratos</p>
                </div>
                <div className="rounded-2xl bg-mint p-3">
                  <p className="font-bold">{targets.fat} g</p>
                  <p className="text-sm text-ink/70">Grasas</p>
                </div>
              </div>
            </div>
            {limitations.length > 0 && (
              <p className="text-ink/80">
                Tus rutinas evitarán ejercicios que carguen:{' '}
                {LIMITS.filter((l) => limitations.includes(l.id))
                  .map((l) => l.label.toLowerCase())
                  .join(', ')}
                .
              </p>
            )}
            <p className="text-sm text-ink/60">
              Es una estimación para empezar. Si tienes una condición de salud,
              consúltalo con un profesional.
            </p>
          </>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className={`rounded-2xl border-2 border-line bg-white px-5 py-3 font-bold ${focus}`}
          >
            Atrás
          </button>
        )}
        <button
          type="button"
          disabled={!valid || saving}
          onClick={() => (step === TOTAL ? finish() : setStep(step + 1))}
          className={`flex-1 rounded-2xl bg-leaf px-5 py-3 text-lg font-bold text-white transition hover:bg-leaf-dark disabled:cursor-not-allowed disabled:opacity-40 ${focus}`}
        >
          {step === TOTAL ? 'Empezar' : 'Continuar'}
        </button>
      </div>
    </div>
  )
}