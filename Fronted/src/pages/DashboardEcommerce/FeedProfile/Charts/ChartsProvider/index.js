import { createContext } from "react";

import { useChartsProvider } from "./useChartsProvider";

export const ChartsContext = createContext()

export function ChartsProvider({children, currentFeederId}) {
  const chartData = useChartsProvider(currentFeederId)

    return (
      <ChartsContext.Provider value={chartData}>
        {children}
      </ChartsContext.Provider>
    );
  }