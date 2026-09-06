/** Unsplash photo pool — one place for every card/poster image on the site (all ids verified to load). */
const U = (id: string, w = 800) => `https://images.unsplash.com/${id}?w=${w}&q=72&auto=format&fit=crop`;
/** moody studio / motion / light + work, teams, writing, tech — for glass cards that would otherwise be empty */
export const POOL = [
  "photo-1698151256842-e658014ea99a", "photo-1695893155131-589f1f600981", "photo-1652809096869-55b40bd14ac1", "photo-1536675572774-1b66ac2e26e9",
  "photo-1764922981561-c2ce524178f6", "photo-1766706871615-037e5bc9d85e", "photo-1691389694412-266f872999c6", "photo-1761998066466-86bd7a1c00ba",
  "photo-1525453719223-4e781eb83a4c", "photo-1531318701087-32c11653dd77", "photo-1509099652299-30938b0aeb63", "photo-1511715282680-fbf93a50e721",
  "photo-1497366216548-37526070297c", "photo-1519389950473-47ba0277781c", "photo-1521737604893-d14cc237f11d", "photo-1504384308090-c894fdcc538d",
  "photo-1460925895917-afdab827c52f", "photo-1553877522-43269d4ea984", "photo-1522071820081-009f0129c71c", "photo-1542744173-8e7e53415bb0",
  "photo-1515378791036-0648a3ef77b2", "photo-1498050108023-c5249f4df085", "photo-1551434678-e076c223a692", "photo-1556761175-b413da4baf72",
  "photo-1517245386807-bb43f82c33c4", "photo-1531403009284-440f080d1e12", "photo-1493612276216-ee3925520721", "photo-1558655146-9f40138edfeb",
  "photo-1561070791-2526d30994b5", "photo-1586717791821-3f44a563fa4c", "photo-1455390582262-044cdead277a", "photo-1516321318423-f06f85e504b3",
  "photo-1432888622747-4eb9a8efeb07", "photo-1485827404703-89b55fcc595e", "photo-1535378620166-273708d44e4c", "photo-1531746790731-6c087fecd65a",
  "photo-1518770660439-4636190af475", "photo-1526374965328-7f61d4dc18c5", "photo-1550745165-9bc0b252726f", "photo-1492724441997-5dc865305da7",
  "photo-1487014679447-9f8336841d58", "photo-1499750310107-5fef28a66643", "photo-1512314889357-e157c22f938d", "photo-1483058712412-4245e9b90334",
  "photo-1541462608143-67571c6738dd", "photo-1626785774573-4b799315345d", "photo-1600880292203-757bb62b4baf", "photo-1552664730-d307ca884978",
  "photo-1531482615713-2afd69097998", "photo-1507925921958-8a62f3d1a50d", "photo-1450101499163-c8848c66ca85", "photo-1434030216411-0b793f4b4173",
  "photo-1542831371-29b0f74f9713", "photo-1555066931-4365d14bab8c", "photo-1523961131990-5ea7c61b2107", "photo-1504868584819-f8e8b4b6d7e3",
  "photo-1451187580459-43490279c0fa", "photo-1478760329108-5c3ed9d495a0", "photo-1507842217343-583bb7270b66", "photo-1559136555-9303baea8ebd",
  "photo-1517048676732-d65bc937f952", "photo-1573164713714-d95e436ab8d6",
].map((id) => U(id));
export const pick = (i: number, w?: number) => POOL[i % POOL.length].replace("w=800", `w=${w ?? 800}`);
/** a photo chosen by the card's own text: stable between renders, different from card to card */
export function photoFor(seed: string, w?: number) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return pick(h % POOL.length, w);
}
/** beautiful website UI shots for device mockups */
export const UI = [
  "photo-1648134859177-66e35b61e106", "photo-1634084462412-b54873c0a56d", "photo-1642132652860-471b4228023e", "photo-1760008486593-a85315610136",
  "photo-1648134859186-a05fb609f41e", "photo-1642132652798-ae887edb9e9d", "photo-1720962158883-b0f2021fb51e", "photo-1677691820099-a6e8040aa077", "photo-1680016661694-1cd3faf31c3a",
].map((id) => U(id, 900));
/** faces for social avatars */
export const FACES = ["photo-1489278353717-f64c6ee8a4d2", "photo-1562337404-3044c84ac061", "photo-1570840934347-4dc56c98b8ef", "photo-1600603406200-5b2a104684ac", "photo-1573294705900-9623cfc746b7"].map((id) => U(id, 160));
