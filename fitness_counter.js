class FitnessCounter {
  constructor(network, testSet) {
    this._network = network;
    this._testSet = testSet;
  }

  _compare(a, b) {
    if (a === b) return 3;
    if (a == null || b == null) return 0;
    if (a.length != b.length) return 0;

    let acc = 3;

    for (let i = 0; i < a.length; ++i) {
      acc -= Math.abs(a[i] - b[i])
    }
    return acc * acc;
  }

  count() {
    let fitness = 0;
    for (let i = 0; i < this._testSet.length; i++ ) {
      let output = this._network.activate(this._testSet[i].input);
      fitness += this._compare(output, this._testSet[i].output)
    }
    return fitness;
  }
}

export default FitnessCounter;
