import fs from 'fs';

const classes = {
  'Iris-setosa': [1, 0, 0],
  'Iris-versicolor': [0, 1, 0],
  'Iris-virginica': [0, 0, 1],
};

const FILE_NAME = './iris-train.txt';
const FILE_ENCODING = 'utf-8'

class DataProvider {
  constructor(ratio) {
    this._ratio = ratio || 20;
    this._prepareDataSet();
    this._prepareTrainingAndTestSet();
  }

  _prepareDataSet() {
    const text = fs.readFileSync(FILE_NAME, FILE_ENCODING).trim();
    const arrayOfLines = text.split("\n");
    const dataSet = arrayOfLines.map(line => {
      const splittedLine = line.split(',');
      const input = splittedLine.slice(0, 4).map(e => parseFloat(e));
      const output = classes[splittedLine[splittedLine.length-1]];
      return {
        input: input,
        output: output,
      };
    });
    this._dataSet = dataSet;
  }

  _prepareTrainingAndTestSet(dataSet) {
    const testSetSize = Math.floor(this._dataSet.length * this._ratio / 100.0);
    this._dataSet = this._shuffle(this._dataSet);
    this._trainingSet = this._dataSet.slice();
    this._testSet = this._trainingSet.splice(0, testSetSize);
  }

  _shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  getTrainingSet() {
    return this._trainingSet;
  }

  getTestSet() {
    return this._testSet;
  }

  getRatio() {
    return this._ratio;
  }
}

export default DataProvider;
