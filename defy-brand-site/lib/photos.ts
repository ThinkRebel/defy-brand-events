/** Unsplash photo pool — one place for every card/poster image on the site. */
const U = (id: string, w = 800) => `https://images.unsplash.com/${id}?w=${w}&q=72&auto=format&fit=crop`;
/** moody studio / motion / light — for glass cards that would otherwise be empty */
export const POOL = [
  "photo-1698151256842-e658014ea99a", "photo-1695893155131-589f1f600981", "photo-1652809096869-55b40bd14ac1", "photo-1536675572774-1b66ac2e26e9",
  "photo-1764922981561-c2ce524178f6", "photo-1766706871615-037e5bc9d85e", "photo-1691389694412-266f872999c6", "photo-1761998066466-86bd7a1c00ba",
  "photo-1525453719223-4e781eb83a4c", "photo-1531318701087-32c11653dd77", "photo-1509099652299-30938b0aeb63", "photo-1511715282680-fbf93a50e721",
].map((id) => U(id));
export const pick = (i: number, w?: number) => POOL[i % POOL.length].replace("w=800", `w=${w ?? 800}`);
/** beautiful website UI shots for device mockups */
export const UI = [
  "photo-1648134859177-66e35b61e106", "photo-1634084462412-b54873c0a56d", "photo-1642132652860-471b4228023e", "photo-1760008486593-a85315610136",
  "photo-1648134859186-a05fb609f41e", "photo-1642132652798-ae887edb9e9d", "photo-1720962158883-b0f2021fb51e", "photo-1677691820099-a6e8040aa077", "photo-1680016661694-1cd3faf31c3a",
].map((id) => U(id, 900));
/** faces for social avatars */
export const FACES = ["photo-1489278353717-f64c6ee8a4d2", "photo-1562337404-3044c84ac061", "photo-1570840934347-4dc56c98b8ef", "photo-1600603406200-5b2a104684ac", "photo-1573294705900-9623cfc746b7"].map((id) => U(id, 160));
