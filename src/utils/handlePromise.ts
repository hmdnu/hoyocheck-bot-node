export async function handlePromise<T>(promise: Promise<T>): Promise<[T | null, unknown | null]> {
  try {
    const data = await promise;

    return [data, null];
  } catch (error) {
    return [null, error];
  }
}
