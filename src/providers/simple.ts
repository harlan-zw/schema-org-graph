import { provideResolver } from '../utils'
import type { OpeningHours } from '../nodes/OpeningHours'
import { resolveOpeningHours } from '../nodes/OpeningHours'
import type { AggregateOffer } from '../nodes/AggregateOffer'
import { aggregateOfferResolver } from '../nodes/AggregateOffer'
import type { AggregateRating } from '../nodes/AggregateRating'
import { aggregateRatingResolver } from '../nodes/AggregateRating'
import type { Article } from '../nodes/Article'
import { articleResolver } from '../nodes/Article'
import type { Breadcrumb } from '../nodes/Breadcrumb'
import { breadcrumbResolver } from '../nodes/Breadcrumb'
import type { Comment } from '../nodes/Comment'
import { commentResolver } from '../nodes/Comment'
import type { Event } from '../nodes/Event'
import { eventResolver } from '../nodes/Event'
import type { VirtualLocation } from '../nodes/Event/VirtualLocation'
import { virtualLocationResolver } from '../nodes/Event/VirtualLocation'
import type { Place } from '../nodes/Event/Place'
import { placeResolver } from '../nodes/Event/Place'
import type { HowTo, HowToStep } from '../nodes/HowTo'
import { howToResolver, howToStepResolver } from '../nodes/HowTo'
import type { Image } from '../nodes/Image'
import { imageResolver } from '../nodes/Image'
import type { LocalBusiness } from '../nodes/LocalBusiness'
import { localBusinessResolver } from '../nodes/LocalBusiness'
import type { Offer } from '../nodes/Offer'
import { offerResolver } from '../nodes/Offer'
import type { Person } from '../nodes/Person'
import { personResolver } from '../nodes/Person'
import type { PostalAddress } from '../nodes/PostalAddress'
import { addressResolver } from '../nodes/PostalAddress'
import type { Product } from '../nodes/Product'
import { productResolver } from '../nodes/Product'
import type { Question } from '../nodes/Question'
import { questionResolver } from '../nodes/Question'
import type { Recipe } from '../nodes/Recipe'
import { recipeResolver } from '../nodes/Recipe'
import type { Review } from '../nodes/Review'
import { reviewResolver } from '../nodes/Review'
import type { Video } from '../nodes/Video'
import { videoResolver } from '../nodes/Video'
import type { WebPage } from '../nodes/WebPage'
import { webPageResolver } from '../nodes/WebPage'
import type { WebSite } from '../nodes/WebSite'
import { webSiteResolver } from '../nodes/WebSite'
import type { Organization } from '../nodes/Organization'
import { organizationResolver } from '../nodes/Organization'

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
