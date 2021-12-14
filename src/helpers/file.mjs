import {open} from 'fs/promises'


export async function streamCharacter(filePath) {
  const handle = await open(filePath, 'r')
  console.log(handle)
  await handle.close()
}
