import type {
  AggregateOffer, AggregateRating,
  Article,
  Book, BookEdition,
  BreadcrumbList,
  Comment,
  Course,
  Event,
  HowTo,
  HowToStep,
  ImageObject,
  ItemList,
  LocalBusiness,
  Movie,
  Offer,
  OpeningHoursSpecification,
  Organization,
  Person,
  Place,
  PostalAddress,
  Product,
  Question,
  ReadAction,
  Recipe,
  Review,
  SoftwareApp,
  SchemaOrgNodeDefinition,
  SearchAction,
  VideoObject,
  VirtualLocation,
  WebPage,
  WebSite,
} from 'schema-org-graph-js'

import {
  addressResolver,
  aggregateOfferResolver,
  aggregateRatingResolver,
  articleResolver, bookEditionResolver,
  bookResolver,
  breadcrumbResolver,
  commentResolver,
  courseResolver,
  eventResolver,
  howToResolver,
  howToStepResolver,
  imageResolver,
  itemListResolver,
  localBusinessResolver,
  movieResolver,
  offerResolver,
  organizationResolver,
  personResolver,
  placeResolver,
  productResolver,
  provideResolver,
  questionResolver,
  readActionResolver,
  recipeResolver, resolveOpeningHours,
  reviewResolver,
  searchActionResolver, softwareAppResolver,
  videoResolver,
  virtualLocationResolver,
  webPageResolver,
  webSiteResolver,
} from 'schema-org-graph-js'

export const defineAddress = <T extends PostalAddress>(input?: T) => provideResolver(input, addressResolver as SchemaOrgNodeDefinition<T>)
export const defineAggregateOffer = <T extends AggregateOffer>(input?: T) => provideResolver(input, aggregateOfferResolver as SchemaOrgNodeDefinition<T>)
export const defineAggregateRating = <T extends AggregateRating>(input?: T) => provideResolver(input, aggregateRatingResolver as SchemaOrgNodeDefinition<T>)
export const defineArticle = <T extends Article>(input?: T) => provideResolver(input, articleResolver as SchemaOrgNodeDefinition<T>)
export const defineBook = <T extends Book>(input?: T) => provideResolver(input, bookResolver as SchemaOrgNodeDefinition<T>)
export const defineBookEdition = <T extends BookEdition>(input?: T) => provideResolver(input, bookEditionResolver as SchemaOrgNodeDefinition<T>)
export const defineBreadcrumb = <T extends BreadcrumbList>(input?: T) => provideResolver(input, breadcrumbResolver as SchemaOrgNodeDefinition<T>)
export const defineComment = <T extends Comment>(input?: T) => provideResolver(input, commentResolver as SchemaOrgNodeDefinition<T>)
export const defineCourse = <T extends Course>(input?: T) => provideResolver(input, courseResolver as SchemaOrgNodeDefinition<T>)
export const defineEvent = <T extends Event>(input?: T) => provideResolver(input, eventResolver as SchemaOrgNodeDefinition<T>)
export const defineVirtualLocation = <T extends VirtualLocation>(input?: T) => provideResolver(input, virtualLocationResolver as SchemaOrgNodeDefinition<T>)
export const definePlace = <T extends Place>(input?: T) => provideResolver(input, placeResolver as SchemaOrgNodeDefinition<T>)
export const defineHowTo = <T extends HowTo>(input?: T) => provideResolver(input, howToResolver as SchemaOrgNodeDefinition<T>)
export const defineHowToStep = <T extends HowToStep>(input?: T) => provideResolver(input, howToStepResolver as SchemaOrgNodeDefinition<T>)
export const defineItemList = <T extends ItemList>(input?: T) => provideResolver(input, itemListResolver as SchemaOrgNodeDefinition<T>)
export const defineImage = <T extends ImageObject>(input?: T) => provideResolver(input, imageResolver as SchemaOrgNodeDefinition<T>)
export const defineLocalBusiness = <T extends LocalBusiness>(input?: T) => provideResolver(input, localBusinessResolver as SchemaOrgNodeDefinition<T>)
export const defineMovie = <T extends Movie>(input?: T) => provideResolver(input, movieResolver as SchemaOrgNodeDefinition<T>)
export const defineOffer = <T extends Offer>(input?: T) => provideResolver(input, offerResolver as SchemaOrgNodeDefinition<T>)
export const defineOpeningHours = <T extends OpeningHoursSpecification>(input?: T) => provideResolver(input, resolveOpeningHours as SchemaOrgNodeDefinition<T>)
export const defineOrganization = <T extends Organization>(input?: T) => provideResolver(input, organizationResolver as SchemaOrgNodeDefinition<T>)
export const definePerson = <T extends Person>(input?: T) => provideResolver(input, personResolver as SchemaOrgNodeDefinition<T>)
export const defineProduct = <T extends Product>(input?: T) => provideResolver(input, productResolver as SchemaOrgNodeDefinition<T>)
export const defineQuestion = <T extends Question>(input?: T) => provideResolver(input, questionResolver as SchemaOrgNodeDefinition<T>)
export const defineRecipe = <T extends Recipe>(input?: T) => provideResolver(input, recipeResolver as SchemaOrgNodeDefinition<T>)
export const defineSoftwareApp = <T extends SoftwareApp>(input?: T) => provideResolver(input, softwareAppResolver as SchemaOrgNodeDefinition<T>)
export const defineReview = <T extends Review>(input?: T) => provideResolver(input, reviewResolver as SchemaOrgNodeDefinition<T>)
export const defineVideo = <T extends VideoObject>(input?: T) => provideResolver(input, videoResolver as SchemaOrgNodeDefinition<T>)
export const defineWebPage = <T extends WebPage>(input?: T) => provideResolver(input, webPageResolver as SchemaOrgNodeDefinition<T>)
export const defineWebSite = <T extends WebSite>(input?: T) => provideResolver(input, webSiteResolver as SchemaOrgNodeDefinition<T>)
export const defineSearchAction = <T extends SearchAction>(input?: T) => provideResolver(input, searchActionResolver as SchemaOrgNodeDefinition<T>)
export const defineReadAction = <T extends ReadAction>(input?: T) => provideResolver(input, readActionResolver as SchemaOrgNodeDefinition<T>)
