import Dexie, { type EntityTable } from 'dexie'

export interface Profile {
  id: number
  name: string
  sex: 'F' | 'M'
  birthYear: number
  heightCm: number
  weightKg: number
  activity: 1.2 | 1.375 | 1.55 | 1.725
  goal: 'lose' | 'maintain' | 'gain'
  limitations: string[] // ej: 'rodilla', 'espalda_baja', 'hombro'
}

export interface Food {
  id?: number
  name: string
  kcalPer100g: number
  proteinPer100g: number
  carbsPer100g: number
  fatPer100g: number
  servingG: number
  servingLabel: string // ej: '1 arepa mediana'
}

export interface MealLog {
  id?: number
  date: string // 'YYYY-MM-DD'
  meal: 'desayuno' | 'almuerzo' | 'cena' | 'snack'
  foodId: number
  grams: number
}

export interface PetState {
  id: number
  name: string
  stage: 1 | 2 | 3 | 4 | 5
  energy: number // sube con hábitos, nunca baja
  totalHabits: number
}

export const db = new Dexie('nutripet') as Dexie & {
  profile: EntityTable<Profile, 'id'>
  foods: EntityTable<Food, 'id'>
  logs: EntityTable<MealLog, 'id'>
  pet: EntityTable<PetState, 'id'>
}

db.version(1).stores({
  profile: 'id',
  foods: '++id, name',
  logs: '++id, date, meal, foodId',
  pet: 'id',
})