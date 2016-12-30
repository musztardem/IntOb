import NetworkEvaluator from './network_evaluator';

const POPULATION_SIZE = 12;
const MUTATION_RATE = 0.2;

class GeneticTrainer {
  constructor(network) {
    this._network = network;
    this._initialize();
  }

  _initialize() {
    this._individualSize = this._getIndividualSize();
    this._population = this._generateInitialPopulation();
  }

  _generateInitialPopulation() {
    let population = [];
    for(let i = 0 ; i < POPULATION_SIZE; i++) {
      let individual = {
        genome: [],
        fitness: 0.0
      };
      for(let j = 0; j < this._individualSize; j++) {
        individual.genome.push(0.5 - Math.random());
      }
      population.push(individual);
    }

    return population;
  }

  _getIndividualSize() {
    const { layers } = this._network;
    return this._individualSize ||
      layers.input.connectedTo[0].size + layers.hidden[0].connectedTo[0].size;
  }

  _applyGenomeToNetwork(genome) {
    const { layers } = this._network;
    const splitLength = layers.input.connectedTo[0].size;
    const inputLayerWeights = genome.slice(0, splitLength);
    const hiddenLayerWeights = genome.slice(splitLength);

    const inputLayerKeys = Object.keys(layers.input.connectedTo[0].connections);
    const hiddenLayerKeys = Object.keys(layers.hidden[0].connectedTo[0].connections);

    for (let i = 0; i < inputLayerKeys.length; i++ ) {
      layers.input.connectedTo[0].connections[inputLayerKeys[i]].weight
        = inputLayerWeights[i];
    }
    for(let i = 0; i < hiddenLayerKeys.length; i++ ) {
      layers.hidden[0].connectedTo[0].connections[hiddenLayerKeys[i]].weight
        = hiddenLayerWeights[i];
    }
  }

  _evaluate(individual, trainingSet) {
    this._applyGenomeToNetwork(individual.genome);
    const networkEvaluator = new NetworkEvaluator(this._network, trainingSet);
    const fitness = networkEvaluator.evaluate();
    individual.fitness = fitness;
  }

  _selection() {
    return this._population.sort((a, b) => {
      return b.fitness - a.fitness;
    }).slice(0, POPULATION_SIZE/2);
  }

  _crossover(mother, father) {
    let sliceIndex = this._individualSize / 2;
    let mother1 = mother.genome.slice(0, sliceIndex);
    let mother2 = mother.genome.slice(sliceIndex);
    let father1 = father.genome.slice(0, sliceIndex);
    let father2 = father.genome.slice(sliceIndex);

    return [
      {
        genome: mother1.concat(father2),
        fitness: 0
      },
      {
        genome: father1.concat(mother2),
        fitness: 0
      }
    ];
  }

  _mutate(child) {
    const indexToMutate = Math.floor(Math.random() * child.genome.length);
    if (Math.random() < 0.5) {
      child.genome[indexToMutate] += MUTATION_RATE;
    } else {
      child.genome[indexToMutate] -= MUTATION_RATE;
    }
    return child;
  }

  _createNewGeneration(individuals) {
    const newGeneration = [];
    for (let i = 0 ; i < POPULATION_SIZE/2; i++) {
      let motherIndex = Math.floor(Math.random() * individuals.length);
      let fatherIndex = Math.floor(Math.random() * individuals.length);

      let mother = individuals[motherIndex];
      let father = individuals[fatherIndex];

      let children = this._crossover(mother, father);

      newGeneration.push(this._mutate(children[0]));
      newGeneration.push(this._mutate(children[1]));
    }

    this._population = newGeneration;
  }

  train(trainingSet) {
    let bestFitness = 0;
    let generations = 0;
    while (bestFitness < 0.9) {
      this._population.map(individual => this._evaluate(individual, trainingSet));
      let selectedIndividuals = this._selection();

      bestFitness = selectedIndividuals[0].fitness;
      // console.log('GENERATION: ' + generations + ', best fitness: ' + bestFitness );
      generations++;

      console.log('--- setosa [1, 0, 0]');
      console.log(this._network.activate([5.0,3.5,1.6,0.6]));
      console.log(this._network.activate([5.1,3.8,1.9,0.4]));
      console.log(this._network.activate([4.8,3.0,1.4,0.3]));
      console.log('--- versicolor [0, 1, 0]');
      console.log(this._network.activate([6.2,2.9,4.3,1.3]));
      console.log(this._network.activate([5.1,2.5,3.0,1.1]));
      console.log(this._network.activate([5.7,2.8,4.1,1.3]));
      console.log('--- virginica [0, 0, 1]');
      console.log(this._network.activate([6.3,3.3,6.0,2.5]));
      console.log(this._network.activate([5.8,2.7,5.1,1.9]));
      console.log(this._network.activate([7.1,3.0,5.9,2.1]));
      console.log();

      this._createNewGeneration(selectedIndividuals);
    }
  }
}

export default GeneticTrainer;
