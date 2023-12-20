import { hideLoaderAtom } from "@libs/atoms";
import { useAtomValue } from "jotai";

export function resetLoaderState() {
  const setHideLoader = useAtomValue(hideLoaderAtom);
  setHideLoader(false);
}
