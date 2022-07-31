import type { DeepPartial } from 'utility-types'
import type { Arrayable, IdReference, OptionalAtKeys, SchemaOrgContext, Thing } from '../../types'
import {
  defineSchemaResolver,
  resolveArrayable, resolveSchemaResolver,
} from '../../utils'
import { defineSchemaOrgComponent } from '../../components/defineSchemaOrgComponent'

type DayOfWeek = 'Friday' |
'Monday' |
'PublicHolidays' |
'Saturday' |
'Sunday' |
'Thursday' |
'Tuesday' |
'Wednesday'

type Time = `${number}${number}:${number}${number}`

export interface OpeningHours extends Thing {
  '@type': 'OpeningHoursSpecification'
  /**
   * The day of the week for which these opening hours are valid.
   */
  dayOfWeek: Arrayable<DayOfWeek>
  /**
   * The opening hour of the place or service on the given day(s) of the week.
   */
  opens?: Time
  /**
   * The closing hour of the place or service on the given day(s) of the week.
   */
  closes?: Time
  /**
   * The date when the item becomes valid.
   */
  validFrom?: string | Date
  /**
   * The date after when the item is not valid. For example, the end of an offer, salary period, or a period of opening hours.
   */
  validThrough?: string | Date
}

export type OpeningHoursInput = OptionalAtKeys<OpeningHours> | IdReference

export function defineOpeningHours<T extends OptionalAtKeys<OpeningHours>>(input: T) {
  return defineSchemaResolver<T, OpeningHours>(input, {
    defaults() {
      return {
        '@type': 'OpeningHoursSpecification',
        'opens': '00:00',
        'closes': '23:59',
      }
    },
  })
}

export function resolveOpeningHours(ctx: SchemaOrgContext, input: Arrayable<OpeningHoursInput>) {
  return resolveArrayable<OpeningHoursInput, OpeningHours>(input, input => resolveSchemaResolver(ctx, defineOpeningHours(input)))
}


