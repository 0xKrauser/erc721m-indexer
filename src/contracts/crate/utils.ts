export function parseList(
  list: [string, bigint, bigint, bigint, bigint, bigint, bigint, boolean, boolean],
): {
  end: bigint
  maxSupply: bigint
  merkleRoot: string
  paused: boolean
  price: bigint
  reserved: boolean
  start: bigint
  unit: bigint
  userSupply: bigint
} {
  return {
    merkleRoot: list[0],
    price: list[1],
    unit: list[2],
    userSupply: list[3],
    maxSupply: list[4],
    start: list[5],
    end: list[6],
    reserved: list[7],
    paused: list[8],
  }
}
