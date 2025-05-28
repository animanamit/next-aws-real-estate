"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { Toaster } from "sonner";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      {children}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--pure-white)',
            border: '1px solid var(--platinum-silver)',
            color: 'var(--soft-black)',
          },
        }}
      />
    </Provider>
  );
}