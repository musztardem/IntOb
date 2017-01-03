class NetworkEvaluator {
  constructor(network, testSet) {
    this._network = network;
    this._testSet = testSet;
  }

  _arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  evaluate() {
    let correctlyClassified = 0;
    for (let i = 0; i < this._testSet.length; i++ ) {
      let output = this._network.activate(this._testSet[i].input);
      for (let j = 0; j < output.length; j++ ){
        output[j] = Math.round(output[j]);
      }
      if (this._arraysEqual(output, this._testSet[i].output)) correctlyClassified++;
    }
    console.log(correctlyClassified + " / " + this._testSet.length + " classified correctly.");

    return correctlyClassified;
  }
}

export default NetworkEvaluator;
