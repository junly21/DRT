import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface MenuState {
  isMenuOpen: boolean;
}

export interface MenuActions {
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
}

type MenuStore = MenuState & MenuActions;

const initialState: MenuState = {
  isMenuOpen: false,
};

export const useMenuStore = create<MenuStore>()(
  devtools(
    (set) => ({
      ...initialState,

      openMenu: () => set({ isMenuOpen: true }),
      closeMenu: () => set({ isMenuOpen: false }),
      toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
    }),
    {
      name: "menu-store",
    }
  )
);
