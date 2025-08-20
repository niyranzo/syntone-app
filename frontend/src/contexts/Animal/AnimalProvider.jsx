import { useAnimalsLogic } from "../../hooks/Animal/useAnimalLogic";
import { AnimalsContext } from "./AnimalContext";

export const AnimalsProvider = ({ children }) => {
  const animalsData = useAnimalsLogic();

  return (
    <AnimalsContext.Provider value={animalsData}>
      {children}
    </AnimalsContext.Provider>
  );
};
