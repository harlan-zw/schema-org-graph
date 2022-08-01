import type { Optional } from 'utility-types'
import {
  IdentityId,
  prefixId,
  provideResolver, resolveId, resolveType, setIfEmpty,
} from '../../utils'
import type { Organization } from '../Organization'
import type { OpeningHoursInput } from '../OpeningHours'
import { resolveOpeningHours } from '../OpeningHours'
import type { SingleImageInput } from '../Image'
import { imageResolver } from '../Image'
import type { DefaultOptionalKeys } from '../../types'
import { defineSchemaOrgResolver, resolveRelation } from '../../core'
import { addressResolver } from '../PostalAddress'

type ValidLocalBusinessSubTypes = 'AnimalShelter' |
'ArchiveOrganization' |
'AutomotiveBusiness' |
'ChildCare' |
'Dentist' |
'DryCleaningOrLaundry' |
'EmergencyService' |
'EmploymentAgency' |
'EntertainmentBusiness' |
'FinancialService' |
'FoodEstablishment' |
'GovernmentOffice' |
'HealthAndBeautyBusiness' |
'HomeAndConstructionBusiness' |
'InternetCafe' |
'LegalService' |
'Library' |
'LodgingBusiness' |
'MedicalBusiness' |
'ProfessionalService' |
'RadioStation' |
'RealEstateAgent' |
'RecyclingCenter' |
'SelfStorage' |
'ShoppingCenter' |
'SportsActivityLocation' |
'Store' |
'TelevisionStation' |
'TouristInformationCenter' |
'TravelAgency'

export interface LocalBusiness extends Organization {
  '@type': ['Organization', 'LocalBusiness'] | ['Organization', 'LocalBusiness', ValidLocalBusinessSubTypes] | ValidLocalBusinessSubTypes
  /**
   * The primary public telephone number of the business.
   */
  telephone?: string
  /**
   * The primary public email address of the business.
   */
  email?: string
  /**
   * The primary public fax number of the business.
   */
  faxNumber?: string
  /**
   * The price range of the business, represented by a string of dollar symbols (e.g., $, $$, or $$$ ).
   */
  priceRange?: string
  /**
   * An array of GeoShape, Place or string definitions.
   */
  areaServed?: unknown
  /**
   * A GeoCoordinates object.
   */
  geo?: unknown
  /**
   * The VAT ID of the business.
   */
  vatID?: string
  /**
   * The tax ID of the business.
   */
  taxID?: string
  /**
   * The currency accepted.
   */
  currenciesAccepted?: string
  /**
   * The operating hours of the business.
   */
  openingHoursSpecification?: OpeningHoursInput[]
}

/**
 * Describes a business which allows public visitation.
 * Typically, used to represent the business 'behind' the website, or on a page about a specific business.
 */
export const localBusinessResolver = defineSchemaOrgResolver<LocalBusiness>({
  defaults: {
    '@type': ['Organization', 'LocalBusiness'],
  },
  resolve(node, ctx) {
    setIfEmpty(node, '@id', prefixId(ctx.meta.canonicalHost, IdentityId))
    setIfEmpty(node, 'url', ctx.meta.canonicalHost)
    setIfEmpty(node, 'currenciesAccepted', ctx.meta.defaultCurrency)

    if (node['@type'])
      node['@type'] = resolveType(node['@type'], ['Organization', 'LocalBusiness']) as ['Organization', 'LocalBusiness', ValidLocalBusinessSubTypes]

    if (node.address)
      node.address = resolveRelation(node.address, ctx, addressResolver)
    if (node.openingHoursSpecification)
      node.openingHoursSpecification = resolveRelation(node.openingHoursSpecification, ctx, resolveOpeningHours)

    if (node.logo) {
      node.logo = resolveRelation(node.logo, ctx, imageResolver, {
        afterResolve(logo) {
          const hasLogo = !!ctx.findNode('#logo')
          if (!hasLogo)
            logo['@id'] = prefixId(ctx.meta.canonicalHost, '#logo')

          setIfEmpty(logo, 'caption', node.name)
        },
      }) as SingleImageInput
    }
    resolveId(node, ctx.meta.canonicalHost)
    return node
  },
})

export const defineLocalBusiness
  = <T extends LocalBusiness>(input?: Optional<T, DefaultOptionalKeys>) =>
    provideResolver(input, localBusinessResolver)
