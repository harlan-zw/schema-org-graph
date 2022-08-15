import type { AggregateOffer, AggregateRating, Article, BreadcrumbList as Breadcrumb, Comment, Event, HowTo, HowToStep, ImageObject as Image, LocalBusiness, Offer, OpeningHours, Organization, Person, Place, PostalAddress, Product, Question, Recipe, Review, VideoObject as Video, VirtualLocation, WebPage, WebSite } from 'schema-dts'
import { provideResolver } from '../utils'
import { articleResolver } from '../nodes/Article'
import { breadcrumbResolver } from '../nodes/Breadcrumb'
import { commentResolver } from '../nodes/Comment'
import { eventResolver } from '../nodes/Event'
import { howToResolver, howToStepResolver } from '../nodes/HowTo'
import { imageResolver } from '../nodes/Image'
import { localBusinessResolver } from '../nodes/LocalBusiness'
import { offerResolver } from '../nodes/Offer'
import { organizationResolver } from '../nodes/Organization'
import { personResolver } from '../nodes/Person'
import { productResolver } from '../nodes/Product'
import { questionResolver } from '../nodes/Question'
import { recipeResolver } from '../nodes/Recipe'
import { reviewResolver } from '../nodes/Review'
import { videoResolver } from '../nodes/Video'
import { webPageResolver } from '../nodes/WebPage'
import { webSiteResolver } from '../nodes/WebSite'
import { addressResolver } from '../nodes/PostalAddress'
import { aggregateOfferResolver } from '../nodes/AggregateOffer'
import { aggregateRatingResolver } from '../nodes/AggregateRating'
import { virtualLocationResolver } from '../nodes/Event/VirtualLocation'
import { placeResolver } from '../nodes/Event/Place'
import { resolveOpeningHours } from '../nodes/OpeningHours'

export const defineAddress = <T extends PostalAddress>(input?: T) => provideResolver(input, addressResolver)
export const defineAggregateOffer = <T extends AggregateOffer>(input?: T) => provideResolver(input, aggregateOfferResolver)
export const defineAggregateRating = <T extends AggregateRating>(input?: T) => provideResolver(input, aggregateRatingResolver)
export const defineArticle = <T extends Article>(input?: T) => provideResolver(input, articleResolver)
export const defineBreadcrumb = <T extends Breadcrumb>(input?: T) => provideResolver(input, breadcrumbResolver)
export const defineComment = <T extends Comment>(input?: T) => provideResolver(input, commentResolver)
export const defineEvent = <T extends Event>(input?: T) => provideResolver(input, eventResolver)
export const defineVirtualLocation = <T extends VirtualLocation>(input?: T) => provideResolver(input, virtualLocationResolver)
export const definePlace = <T extends Place>(input?: T) => provideResolver(input, placeResolver)
export const defineHowTo = <T extends HowTo>(input?: T) => provideResolver(input, howToResolver)
export const defineHowToStep = <T extends HowToStep>(input?: T) => provideResolver(input, howToStepResolver)
export const defineImage = <T extends Image>(input?: T) => provideResolver(input, imageResolver)
export const defineLocalBusiness = <T extends LocalBusiness>(input?: T) => provideResolver(input, localBusinessResolver)
export const defineOffer = <T extends Offer>(input?: T) => provideResolver(input, offerResolver)
export const defineOpeningHours = <T extends OpeningHours>(input?: T) => provideResolver(input, resolveOpeningHours)
export const defineOrganization = <T extends Organization>(input?: T) => provideResolver(input, organizationResolver)
export const definePerson = <T extends Person>(input?: T) => provideResolver(input, personResolver)
export const defineProduct = <T extends Product>(input?: T) => provideResolver(input, productResolver)
export const defineQuestion = <T extends Question>(input?: T) => provideResolver(input, questionResolver)
export const defineRecipe = <T extends Recipe>(input?: T) => provideResolver(input, recipeResolver)
export const defineReview = <T extends Review>(input?: T) => provideResolver(input, reviewResolver)
export const defineVideo = <T extends Video>(input?: T) => provideResolver(input, videoResolver)
export const defineWebPage = <T extends WebPage>(input?: T) => provideResolver(input, webPageResolver)
export const defineWebSite = <T extends WebSite>(input?: T) => provideResolver(input, webSiteResolver)
