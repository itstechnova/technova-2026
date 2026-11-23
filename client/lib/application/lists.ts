import 'server-only'

import schools from './data/mlh-schools.json'
import type { ListName } from './types'

// The lists behind "lookup" questions. They are too long to ship with the form, so the form
// fetches them from /api/lists/[list] and the submit action checks answers against them here.
//
// schools: MLH's verified schools, which MLH requires member events to use. To refresh it, take
// https://github.com/MLH/mlh-policies/blob/main/schools.csv, drop its first line (a note, not a
// school) and save the names as a JSON array in data/mlh-schools.json.
const LISTS: Record<ListName, readonly string[]> = { schools }

const ENTRIES: Record<ListName, ReadonlySet<string>> = { schools: new Set(schools) }

export const isListName = (value: string): value is ListName => Object.hasOwn(LISTS, value)

export const listEntries = (list: ListName): readonly string[] => LISTS[list]

export const isOnList = (list: ListName, value: string): boolean => ENTRIES[list].has(value)
