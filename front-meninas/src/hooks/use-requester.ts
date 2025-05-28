import { useCallback, useMemo, useState } from "react";

type MutateFn<B, R> = (body: B) => Promise<R>;

interface UseRequester<B = any, R = any> {
  mutateFn: MutateFn<B, R>;
  onSuccess?: (data: R) => void;
  onError?: (error: unknown) => void;
  onFinally?: () => void;
}

export const useRequester = <Body = any, Response = any>({
  mutateFn,
  onSuccess,
  onError,
  onFinally,
}: UseRequester<Body, Response>) => {
  type Fn = typeof mutateFn;
  type B = Parameters<Fn>[0];
  type R = ReturnType<Fn>;

  const [data, setData] = useState<R | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  const mutation = useCallback(
    async (body: B): Promise<R> => {
      setIsPending(true);
      setError(null);
      try {
        const result = await mutateFn(body);

        //@ts-ignore
        setData(result?.data);
        //@ts-ignore
        onSuccess?.(result?.data);
        return result;
      } catch (err: any) {
        setError(err);
        onError?.(err);
        throw err;
      } finally {
        setIsPending(false);
        onFinally?.();
      }
    },
    [mutateFn, onSuccess, onError, onFinally]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsPending(false);
  }, []);

  return useMemo(
    () => ({ mutation, data, isPending, error, reset }),
    [mutation, data, isPending, error, reset]
  );
};
