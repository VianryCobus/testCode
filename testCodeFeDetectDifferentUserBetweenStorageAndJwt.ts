class UserDetection {
  public userIdStorage: string | null = null;
  public userIdJwt: string | null = null;
  constructor(data: {
    userIdFromStorage: string | number | null,
    userIdFromJwt: string | number | null,
  }){
    this.userIdJwt = String(data.userIdFromJwt);
    this.userIdStorage = String(data.userIdFromStorage)
  }
  public detectMultipleDifferentUserOnBrowser(data: {
    userIdFromStorage: string,
    userIdFromJwt: string,
  }): boolean {
    const { userIdFromStorage, userIdFromJwt, ...rest} = data;
    if (userIdFromStorage.toLocaleLowerCase() !== userIdFromJwt.toLocaleLowerCase()) {
      return true;
    }
    return false;
  }
}


// ===== test code
// case 1
let data = {
  userIdFromStorage: "aaa",
  userIdFromJwt: "aaa"
}
const case1 = new UserDetection(data).detectMultipleDifferentUserOnBrowser(data)
console.log(`RESULT CASE 1 : `, case1)

if (case1) {
  console.log(`FAILED`)
} else {
  console.log(`PASSED`)
}
// case 2
data = {
  userIdFromStorage: "aaaB",
  userIdFromJwt: "aaab"
}
const case2 = new UserDetection(data).detectMultipleDifferentUserOnBrowser(data)
console.log(`RESULT CASE 2 : `, case2)

if (case2) {
  console.log(`FAILED`)
} else {
  console.log(`PASSED`)
}

// case 3
data = {
  userIdFromStorage: "aaabbc",
  userIdFromJwt: "aaabc"
}
const case3 = new UserDetection(data).detectMultipleDifferentUserOnBrowser(data)
console.log(`RESULT CASE 3 : `, case3)

if (case3) {
  console.log(`PASSED`)
} else {
  console.log(`FAILED`)
}