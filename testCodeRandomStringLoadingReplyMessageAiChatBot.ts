class RandomStringMessageLoading {
  public stringPossibility = [
    "Thinking",
    "Generating response",
    "Hang tight, working on it",
    "One sec, processing your request",
    "Please wait, putting it all together",
    "Almost ready, just a moment",
    "Hang on, fetching some data",
    "Processing, please bear with me",
    "One moment, putting it all together",
    "Just a moment",
    "Just a sec, gathering more information",
    "One sec, getting the details",
    "Almost there",
    "Almost ready, just a moment",
    "One sec, analyzing data",
    "Hold on, processing your request",
  ];
  
  constructor() {
  };

  public async establishPlaceholder() {
    let isLoading: boolean = false;
    let intervalId: any = null;
    let numberSecond = 1;
    let randomIndexArray: number = Math.floor(Math.random() * (this.stringPossibility.length - 1));
    const pushData: () => Promise<string> = () => {
      return new Promise((resolve, reject) => {
        intervalId = setInterval(() => {
          if (numberSecond % 7 === 0){
            const tempRandom: number = Math.floor(Math.random() * (this.stringPossibility.length - 1))
            console.log(`tempRandom`, tempRandom)
            randomIndexArray = tempRandom === randomIndexArray ?
              randomIndexArray === this.stringPossibility.length - 1 ?
              randomIndexArray - 1 :
              randomIndexArray + 1
            : tempRandom;
            numberSecond = 1;
          }
          console.log(this.provideStringText({
            numberSecond,
            randomIndexArray
          }))
          numberSecond++;
        }, 500)
        setTimeout(() => {
          clearInterval(intervalId)
          numberSecond = 0;
          resolve('complete');
        }, 55000)
      })
    }
    return await pushData()
  }

  public provideStringText(data: {
    numberSecond: number;
    randomIndexArray: number;
  }) {
    let howManyDots: number = data.numberSecond % 3;
    let stringDots: string = ``;
    if (howManyDots === 0){
      stringDots = `...`
    } else {
      for (let i = 0; i < howManyDots; i++){
        stringDots += `.`;
      }
    }
    console.log(`randomIndexArray`, data.randomIndexArray)
    const returnString: string = `${this.stringPossibility[data.randomIndexArray]} ${stringDots}`
    return returnString;
  }
  
}

const run = new RandomStringMessageLoading()
console.log(run.establishPlaceholder().catch(console.error))