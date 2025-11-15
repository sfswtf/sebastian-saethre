import { create } from 'zustand';

interface VideoStore {
  videoEnded: boolean;
  setVideoEnded: (ended: boolean) => void;
}

export const useVideoStore = create<VideoStore>((set) => ({
  videoEnded: false,
  setVideoEnded: (ended: boolean) => set({ videoEnded: ended }),
}));

