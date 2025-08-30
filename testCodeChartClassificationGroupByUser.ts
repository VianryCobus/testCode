type aggregateProductivityGroupByUserType = {
    userId: string,
    productiveCount: number,
    passiveCount: number,
    nonProductiveCount: number,
    totalCount: number,
    totalProductiveHours: number,
}

function aggregateProductivityGroupByUser(input: Array<any>, sort: "asc" | "desc" = "desc"): Array<aggregateProductivityGroupByUserType> {
    let result: Array<aggregateProductivityGroupByUserType> = [];
    input.forEach((item, index) => {
      const userIdExist = result.find((e: any) => String(e.userId) === String(item.userId))
      if (userIdExist) {
        userIdExist.totalProductiveHours = (userIdExist.productiveCount + item.productiveCount) / 4;
        userIdExist.productiveCount += item.productiveCount;
        userIdExist.passiveCount += item.passiveCount;
        userIdExist.nonProductiveCount += item.nonProductiveCount;
        userIdExist.totalCount += item.totalCount;
      } else {
        result.push({
          userId: item.userId,
          productiveCount: item.productiveCount,
          passiveCount: item.passiveCount,
          nonProductiveCount: item.nonProductiveCount,
          totalCount: item.totalCount,
          totalProductiveHours: item.productiveCount / 4,
        })
      }
    })
    // sort
    if (sort === "desc")
      result.sort((a, b) => b.totalProductiveHours - a.totalProductiveHours);
    else if (sort === "asc")
      result.sort((a, b) => a.totalProductiveHours - b.totalProductiveHours);
    // only top 10 most productive
    const maxRows: number = 10;
    if (result.length > maxRows)
      result = result.slice(0, 10);
    return result;
}

const data = [
  {
    // _id: new ObjectId("677b4ed17b944bd4d283164e"),
    // userId: new ObjectId("666950b7aac74a4f192fbb92"),
    _id: "677b4ed17b944bd4d283164e",
    userId: "666950b7aac74a4f192fbb92",
    productiveCount: 4,
    passiveCount: 0,
    nonProductiveCount: 0,
    totalCount: 4,
    // projectHours: [ [Object] ],
    // taskHours: [ [Object] ],
    // classifications: [ [Object], [Object], [Object], [Object] ],
    // groupClassifications: [ [Object], [Object] ],
    createdAt: new Date("2025-01-06T03:32:33.690Z")
  },
  {
    _id: "677decb84aa89803ca437b39",
    userId: "666aaaaaa",
    productiveCount: 7,
    passiveCount: 0,
    nonProductiveCount: 0,
    totalCount: 7,
    // projectHours: [ [Object] ],
    // taskHours: [ [Object] ],
    // classifications: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
    // groupClassifications: [ [Object], [Object] ],
    createdAt: new Date("2025-01-08T03:10:48.846Z")
  },
  {
    _id: "677decb84aa89803ca437b39",
    userId: "666950b7aac74a4f192fbb92",
    productiveCount: 22,
    passiveCount: 0,
    nonProductiveCount: 0,
    totalCount: 22,
    // projectHours: [ [Object] ],
    // taskHours: [ [Object] ],
    // classifications: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
    // groupClassifications: [ [Object], [Object] ],
    createdAt: new Date("2025-01-08T03:10:48.846Z")
  },
  {
    _id: "677decb84aa89803ca437b39",
    userId: "666aaaaaa",
    productiveCount: 8,
    passiveCount: 0,
    nonProductiveCount: 0,
    totalCount: 8,
    // projectHours: [ [Object] ],
    // taskHours: [ [Object] ],
    // classifications: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
    // groupClassifications: [ [Object], [Object] ],
    createdAt: new Date("2025-01-08T03:10:48.846Z")
  },
  {
    _id: "677decb84aa89803ca437b39",
    userId: "666aaaaaab",
    productiveCount: 8,
    passiveCount: 0,
    nonProductiveCount: 0,
    totalCount: 8,
    // projectHours: [ [Object] ],
    // taskHours: [ [Object] ],
    // classifications: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
    // groupClassifications: [ [Object], [Object] ],
    createdAt: new Date("2025-01-08T03:10:48.846Z")
  },
  {
    _id: "677decb84aa89803ca437b39",
    userId: "666aaaaaac",
    productiveCount: 8,
    passiveCount: 0,
    nonProductiveCount: 0,
    totalCount: 8,
    // projectHours: [ [Object] ],
    // taskHours: [ [Object] ],
    // classifications: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
    // groupClassifications: [ [Object], [Object] ],
    createdAt: new Date("2025-01-08T03:10:48.846Z")
  },
  {
    _id: "677decb84aa89803ca437b39",
    userId: "666aaaaaad",
    productiveCount: 6,
    passiveCount: 0,
    nonProductiveCount: 0,
    totalCount: 6,
    // projectHours: [ [Object] ],
    // taskHours: [ [Object] ],
    // classifications: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
    // groupClassifications: [ [Object], [Object] ],
    createdAt: new Date("2025-01-08T03:10:48.846Z")
  },
  {
    _id: "677decb84aa89803ca437b39",
    userId: "666aaaaaae",
    productiveCount: 8,
    passiveCount: 0,
    nonProductiveCount: 0,
    totalCount: 8,
    // projectHours: [ [Object] ],
    // taskHours: [ [Object] ],
    // classifications: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
    // groupClassifications: [ [Object], [Object] ],
    createdAt: new Date("2025-01-08T03:10:48.846Z")
  },
  {
    _id: "677decb84aa89803ca437b39",
    userId: "666aaaaaaf",
    productiveCount: 2,
    passiveCount: 0,
    nonProductiveCount: 0,
    totalCount: 2,
    // projectHours: [ [Object] ],
    // taskHours: [ [Object] ],
    // classifications: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
    // groupClassifications: [ [Object], [Object] ],
    createdAt: new Date("2025-01-08T03:10:48.846Z")
  },
  {
    _id: "677decb84aa89803ca437b39",
    userId: "666aaaaaag",
    productiveCount: 3,
    passiveCount: 0,
    nonProductiveCount: 0,
    totalCount: 3,
    // projectHours: [ [Object] ],
    // taskHours: [ [Object] ],
    // classifications: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
    // groupClassifications: [ [Object], [Object] ],
    createdAt: new Date("2025-01-08T03:10:48.846Z")
  },
  {
    _id: "677decb84aa89803ca437b39",
    userId: "666aaaaaah",
    productiveCount: 8,
    passiveCount: 0,
    nonProductiveCount: 0,
    totalCount: 8,
    // projectHours: [ [Object] ],
    // taskHours: [ [Object] ],
    // classifications: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
    // groupClassifications: [ [Object], [Object] ],
    createdAt: new Date("2025-01-08T03:10:48.846Z")
  },
  {
    _id: "677decb84aa89803ca437b39",
    userId: "666aaaaaai",
    productiveCount: 8,
    passiveCount: 0,
    nonProductiveCount: 0,
    totalCount: 8,
    // projectHours: [ [Object] ],
    // taskHours: [ [Object] ],
    // classifications: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
    // groupClassifications: [ [Object], [Object] ],
    createdAt: new Date("2025-01-08T03:10:48.846Z")
  },
]
;
console.log(aggregateProductivityGroupByUser(data, 'desc'))