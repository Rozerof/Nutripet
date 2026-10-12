import type { Profile } from '../db'

export function dailyTargets(p: Profile) {
  const age = new Date().getFullYear() - p.birthYear
  // Mifflin-St Jeor
  const bmr =
    10 * p.weightKg + 6.25 * p.heightCm - 5 * age + (p.sex === 'M' ? 5 : -161)
  const tdee = bmr * p.activity

  const adjust = { lose: 0.85, maintain: 1, gain: 1.1 }[p.goal]
  const floor = p.sex === 'M' ? 1500 : 1200 // mínimo de seguridad
  const kcal = Math.round(Math.max(tdee * adjust, floor))

  const protein = Math.round(p.weightKg * 1.6)
  const fat = Math.round((kcal * 0.25) / 9)
  const carbs = Math.round((kcal - protein * 4 - fat * 9) / 4)

  return { kcal, protein, fat, carbs, tdee: Math.round(tdee) }
}