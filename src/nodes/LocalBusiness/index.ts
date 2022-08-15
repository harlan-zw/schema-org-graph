import {
  IdentityId,
  prefixId, resolveDefaultType,
  setIfEmpty,
} from '../../utils'
import type { Organization } from '../Organization'
import type { OpeningHours } from '../OpeningHours'
import { resolveOpeningHours } from '../OpeningHours'
import { imageResolver } from '../Image'
import type { NodeRelations } from '../../types'
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

export interface LocalBusinessLite extends Organization {
  '@type'?: ['Organization', 'LocalBusiness'] | ['Organization', 'LocalBusiness', ValidLocalBusinessSubTypes] | ValidLocalBusinessSubTypes
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
  openingHoursSpecification?: NodeRelations<OpeningHours>
}

export interface LocalBusiness extends LocalBusinessLite {}

/**
 * Describes a business which allows public visitation.
 * Typically, used to represent the business 'behind' the website, or on a page about a specific business.
 */
export const localBusinessResolver = defineSchemaOrgResolver<LocalBusiness>({
  defaults: {
    '@type': ['Organization', 'LocalBusiness'],
  },
  inheritMeta: [
    { key: 'url', meta: 'host' },
    { key: 'currenciesAccepted', meta: 'currency' },
  ],
  resolve(node, ctx) {
    setIfEmpty(node, '@id', prefixId(ctx.meta.host, IdentityId))

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
            logo['@id'] = prefixId(ctx.meta.host, '#logo')

          setIfEmpty(logo, 'caption', node.name)
        },
      })
    }
    resolveId(node, ctx.meta.host)
    return node
  },
})
