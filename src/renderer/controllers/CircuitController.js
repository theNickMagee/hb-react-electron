const { getOrderedPaths } = require('../services/CircuitServices');

const playCircuit = (data) => {
  console.log('data: ', JSON.stringify(data, null, 2));
  // play the circuit
  const orderedPaths = getOrderedPaths(data.wires, data.boardObjects);

  console.log('orderedPaths: ', orderedPaths);
};

export { playCircuit };
