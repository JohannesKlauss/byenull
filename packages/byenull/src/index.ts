/**
 * Re-exports core Option-handling utilities under two convenient namespaces:
 *
 * - `Option`: verbose and explicit usage
 * - `O`: shorthand alias for more concise code
 *
 * @example Basic usage
 * ```ts
 * import { Option } from 'byenull';
 *
 * type User = { id: string; name: string };
 * type Article = { title: string; author: User };
 *
 * const users: User[] = [{ id: 'u123', name: 'Alice' }];
 * const articles: Article[] = [
 *   { title: 'Hello byenull', author: { id: 'u123', name: 'Alice' } },
 * ];
 *
 * const findUser = Option.fn((id: string, users: User[]) =>
 *   users.find((user) => user.id === id),
 * );
 *
 * const findArticleByUserName = Option.fn((userName: string, articles: Article[]) =>
 *   articles.find((article) => article.author.name === userName),
 * );
 *
 * const article = Option.pipe(
 *   Option.some('u123'),
 *   Option.andThen((id) => findUser(id, users)),
 *   Option.map((user) => user.name),
 *   Option.andThen((name) => findArticleByUserName(name, articles)),
 * );
 *
 * if (Option.isSome(article)) {
 *   console.log(article.value); // { title: 'Hello byenull', author: { ... } }
 * }
 * ```
 *
 * @example Shorthand usage
 * ```ts
 * import { O } from 'byenull';
 *
 * type User = { id: string; name: string };
 * type Article = { title: string; author: User };
 *
 * const users: User[] = [{ id: 'u123', name: 'Alice' }];
 * const articles: Article[] = [
 *   { title: 'Hello byenull', author: { id: 'u123', name: 'Alice' } },
 * ];
 *
 * const findUser = O.fn((id: string, users: User[]) =>
 *   users.find((user) => user.id === id),
 * );
 *
 * const findArticleByUserName = O.fn((userName: string, articles: Article[]) =>
 *   articles.find((article) => article.author.name === userName),
 * );
 *
 * const article = O.pipe(
 *   O.some('u123'),
 *   O.andThen((id) => findUser(id, users)),
 *   O.map((user) => user.name),
 *   O.andThen((name) => findArticleByUserName(name, articles)),
 * );
 *
 * if (O.isSome(article)) {
 *   console.log(article.value); // { title: 'Hello byenull', author: { ... } }
 * }
 * ```
 */
export * as Option from "./exports";

/**
 * Shorthand alias for {@link Option}.
 */
export * as O from "./exports";
