/**
 * Re-exports core Option-handling utilities under two convenient namespaces:
 *
 * - `Option`: Verbose and explicit usage
 * - `O`: Shorthand alias for more concise code
 *
 * @example Basic Usage
 * ```ts
 * import { Option } from 'byenull';
 *
 * const divideByZero = (x: number, y: number) => {
 *   if (y === 0) {
 *     return Option.none();
 *   }
 *   return Option.some(x / y);
 * };
 *
 * const findUser = Option.fn((id: string, users: User[]) =>
 *   return users.find(u => u.id === id);
 * );
 *
 * const filterArticlesByUserName = Option.fn((userName: string, articles: Article[]) =>
 *   return articles.find(a => a.author.name === user.name);
 * );
 *
 * const articles = Option.pipe(
 *   findUser("u213")
 *   Option.map(user => user.name),
 *   Option.andThen(filterArticlesByUserName),
 * );
 *
 * if (Option.isSuccess(articles)) {
 *   console.log(articles.value); // Articles for username
 * }
 * ```
 *
 * @example Shorthand Usage
 * ```ts
 * import { O } from 'byenull';
 *
 * const divideByZero = (x: number, y: number) => {
 *   if (y === 0) {
 *     return O.none();
 *   }
 *   return O.some(x / y);
 * };
 *
 * const findUser = O.fn((id: string, users: User[]) =>
 *   return users.find(u => u.id === id);
 * );
 *
 * const filterArticlesByUserName = O.fn((userName: string, articles: Article[]) =>
 *   return articles.find(a => a.author.name === user.name);
 * );
 *
 * const articles = O.pipe(
 *   findUser("u213")
 *   O.map(user => user.name),
 *   O.andThen(filterArticlesByUserName),
 * );
 *
 * if (O.isSuccess(articles)) {
 *   console.log(articles.value); // Articles for username
 * }
 * ```
 */
export * as Option from './exports';

/**
 * Shorthand alias for {@link Option}.
 */
export * as O from './exports';