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
  SchemaOrgNodeDefinition,
  SearchAction,
  SoftwareApp,
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

export const defineAddress = /* @__PURE__ */ <T extends PostalAddress>(input?: T) => provideResolver(input, addressResolver as SchemaOrgNodeDefinition<T>)
export const defineAggregateOffer = /* @__PURE__ */ <T extends AggregateOffer>(input?: T) => provideResolver(input, aggregateOfferResolver as SchemaOrgNodeDefinition<T>)
export const defineAggregateRating = /* @__PURE__ */ <T extends AggregateRating>(input?: T) => provideResolver(input, aggregateRatingResolver as SchemaOrgNodeDefinition<T>)
export const defineArticle = /* @__PURE__ */ <T extends Article>(input?: T) => provideResolver(input, articleResolver as SchemaOrgNodeDefinition<T>)
export const defineBook = /* @__PURE__ */ <T extends Book>(input?: T) => provideResolver(input, bookResolver as SchemaOrgNodeDefinition<T>)
export const defineBookEdition = /* @__PURE__ */ <T extends BookEdition>(input?: T) => provideResolver(input, bookEditionResolver as SchemaOrgNodeDefinition<T>)
export const defineBreadcrumb = /* @__PURE__ */ <T extends BreadcrumbList>(input?: T) => provideResolver(input, breadcrumbResolver as SchemaOrgNodeDefinition<T>)
export const defineComment = /* @__PURE__ */ <T extends Comment>(input?: T) => provideResolver(input, commentResolver as SchemaOrgNodeDefinition<T>)
export const defineCourse = /* @__PURE__ */ <T extends Course>(input?: T) => provideResolver(input, courseResolver as SchemaOrgNodeDefinition<T>)
export const defineEvent = /* @__PURE__ */ <T extends Event>(input?: T) => provideResolver(input, eventResolver as SchemaOrgNodeDefinition<T>)
export const defineVirtualLocation = /* @__PURE__ */ <T extends VirtualLocation>(input?: T) => provideResolver(input, virtualLocationResolver as SchemaOrgNodeDefinition<T>)
export const definePlace = /* @__PURE__ */ <T extends Place>(input?: T) => provideResolver(input, placeResolver as SchemaOrgNodeDefinition<T>)
export const defineHowTo = /* @__PURE__ */ <T extends HowTo>(input?: T) => provideResolver(input, howToResolver as SchemaOrgNodeDefinition<T>)
export const defineHowToStep = /* @__PURE__ */ <T extends HowToStep>(input?: T) => provideResolver(input, howToStepResolver as SchemaOrgNodeDefinition<T>)
export const defineItemList = /* @__PURE__ */ <T extends ItemList>(input?: T) => provideResolver(input, itemListResolver as SchemaOrgNodeDefinition<T>)
export const defineImage = /* @__PURE__ */ <T extends ImageObject>(input?: T) => provideResolver(input, imageResolver as SchemaOrgNodeDefinition<T>)
export const defineLocalBusiness = /* @__PURE__ */ <T extends LocalBusiness>(input?: T) => provideResolver(input, localBusinessResolver as SchemaOrgNodeDefinition<T>)
export const defineMovie = /* @__PURE__ */ <T extends Movie>(input?: T) => provideResolver(input, movieResolver as SchemaOrgNodeDefinition<T>)
export const defineOffer = /* @__PURE__ */ <T extends Offer>(input?: T) => provideResolver(input, offerResolver as SchemaOrgNodeDefinition<T>)
export const defineOpeningHours = /* @__PURE__ */ <T extends OpeningHoursSpecification>(input?: T) => provideResolver(input, resolveOpeningHours as SchemaOrgNodeDefinition<T>)
export const defineOrganization = /* @__PURE__ */ <T extends Organization>(input?: T) => provideResolver(input, organizationResolver as SchemaOrgNodeDefinition<T>)
export const definePerson = /* @__PURE__ */ <T extends Person>(input?: T) => provideResolver(input, personResolver as SchemaOrgNodeDefinition<T>)
export const defineProduct = /* @__PURE__ */ <T extends Product>(input?: T) => provideResolver(input, productResolver as SchemaOrgNodeDefinition<T>)
export const defineQuestion = /* @__PURE__ */ <T extends Question>(input?: T) => provideResolver(input, questionResolver as SchemaOrgNodeDefinition<T>)
export const defineRecipe = /* @__PURE__ */ <T extends Recipe>(input?: T) => provideResolver(input, recipeResolver as SchemaOrgNodeDefinition<T>)
export const defineSoftwareApp = /* @__PURE__ */ <T extends SoftwareApp>(input?: T) => provideResolver(input, softwareAppResolver as SchemaOrgNodeDefinition<T>)
export const defineReview = /* @__PURE__ */ <T extends Review>(input?: T) => provideResolver(input, reviewResolver as SchemaOrgNodeDefinition<T>)
export const defineVideo = /* @__PURE__ */ <T extends VideoObject>(input?: T) => provideResolver(input, videoResolver as SchemaOrgNodeDefinition<T>)
export const defineWebPage = /* @__PURE__ */ <T extends WebPage>(input?: T) => provideResolver(input, webPageResolver as SchemaOrgNodeDefinition<T>)
export const defineWebSite = /* @__PURE__ */ <T extends WebSite>(input?: T) => provideResolver(input, webSiteResolver as SchemaOrgNodeDefinition<T>)
export const defineSearchAction = /* @__PURE__ */ <T extends SearchAction>(input?: T) => provideResolver(input, searchActionResolver as SchemaOrgNodeDefinition<T>)
export const defineReadAction = /* @__PURE__ */ <T extends ReadAction>(input?: T) => provideResolver(input, readActionResolver as SchemaOrgNodeDefinition<T>)
