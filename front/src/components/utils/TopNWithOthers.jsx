import React from "react";

/**
 * Componente de renderizado que aplica la lógica "Top N + Others"
 * y entrega los datos transformados como children render prop.
 *
 * @param {Array} data - Lista de objetos a procesar
 * @param {number} n - Número de elementos top a mostrar (default: 5)
 * @param {string} valueKey - Clave del valor a comparar (default: "value")
 * @param {string} nameKey - Clave para el nombre/etiqueta (default: "name")
 * @param {string} othersLabel - Nombre de la categoría agregada (default: "Otros")
 * @param {Function} children - Función de render que recibe los datos transformados
 */

const TopNWithOthers = ({
  data = [],
  n = 5,
  valueKey = "value",
  nameKey = "name",
  othersLabel = "Otros",
  children
}) => {
  if (!Array.isArray(data) || data.length <= n) {
    return children(data);
  }

  const sorted = [...data].sort((a, b) => b[valueKey] - a[valueKey]);
  const top = sorted.slice(0, n);
  const others = sorted.slice(n);

  const avg =
    others.reduce((acc, item) => acc + item[valueKey], 0) / others.length;

  const aggregated = {
    ...others[0], // mantiene posibles otras propiedades
    [nameKey]: othersLabel,
    [valueKey]: Math.round(avg * 100) / 100
  };

  const result = [...top, aggregated];

  return children(result);
};

export default TopNWithOthers;
