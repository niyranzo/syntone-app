import { useContext } from "react";
import { AnimalsContext } from "../../contexts/Animal/AnimalContext";

export const useAnimals = () => {
  const context = useContext(AnimalsContext);
  if (!context) {
    throw new Error("useAnimals debe usarse dentro de <AnimalsProvider>");
  }
  return context;
};
