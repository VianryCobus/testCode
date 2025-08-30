type inputCollectSourceData = {
  startTime: string,
  endTime: string,
  userId: string,
  excludedIdTimetrack?: string | undefined | null,
}

type timeTrackingData = {
  _id: string,
  startTime: string,
  endTime: string,
  duration: number,
  userId: string,
  projectId: string,
  taskId: string,
  companyId: string,
  status: "start" | "in_progress" | "offline" | "stop",
  device: "mobile" | "web" | "manual",
  manualReason: string,
  createdBy: string,
  updatedBy: string,
  timeManualStatus: "Pending" | "Reject" | "Approve",
  createdAt: string,
  updatedAt: string,
  generalDescription: string,
  offlineTime: string | null,
}

type validateManualTimeType = {
  timeTrackingData: Array<timeTrackingData>,
  startTime: string,
  endTime: string,
}

class ManualTime {
  constructor(){}

  async collectSourceDataValidateManualTime(data: inputCollectSourceData) {
    // declaration variable
    let startDateTimeFilter: string;
    let endDateTimeFilter: string;
    // get startTime manual only date
    const startTimeDate: string = new Date(new Date(data.startTime).getTime()).toISOString().split('T')[0];
    // get endTime manual only date
    const endTimeDate: string = new Date(new Date(data.endTime).getTime()).toISOString().split('T')[0];
    startDateTimeFilter = `${startTimeDate}T00:00:00.000Z`;
    endDateTimeFilter = `${endTimeDate}T24:00:00.000Z`;
    // query all timetracking data for corresponding userId between startTime day :00:00:00 and endTime day :24:00:00
    const getTimetrackingData: Promise<Array<timeTrackingData>> = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([
          {
            _id: "67dd2a11ed77ca470f944bed",
            startTime: "2025-03-21T08:57:53.971+00:00",
            endTime: "2025-03-21T13:03:01.011+00:00",
            duration: 14708011,
            userId: "66692444bd1b937e34be213b",
            projectId: "67bd3154a7e4d1191bb8b336",
            taskId: "67bd646caf690dc0791f373b",
            companyId: "66692444bd1b937e34be2140",
            status: "in_progress",
            device: "mobile",
            manualReason: "",
            createdBy: "66692444bd1b937e34be213b",
            updatedBy: "66692444bd1b937e34be213b",
            timeManualStatus: "Pending",
            createdAt: "2025-03-21T08:57:54.001+00:00",
            updatedAt: "2025-03-21T13:03:01.011+00:00",
            generalDescription: "Update endTime and status by CRONJOB",
            offlineTime: null,
          },
          {
            _id: "67dd2a11ed77ca470f944bed",
            startTime: "2025-05-04T21:00:00.000+00:00",
            endTime: "2025-05-04T22:00:00.000+00:00",
            duration: 14708011,
            userId: "66692444bd1b937e34be213b",
            projectId: "67bd3154a7e4d1191bb8b336",
            taskId: "67bd646caf690dc0791f373b",
            companyId: "66692444bd1b937e34be2140",
            status: "in_progress",
            device: "mobile",
            manualReason: "",
            createdBy: "66692444bd1b937e34be213b",
            updatedBy: "66692444bd1b937e34be213b",
            timeManualStatus: "Pending",
            createdAt: "2025-03-21T08:57:54.001+00:00",
            updatedAt: "2025-03-21T13:03:01.011+00:00",
            generalDescription: "Update endTime and status by CRONJOB",
            offlineTime: null,
          },
          {
            _id: "67dd2a11ed77ca470f944bed",
            startTime: "2025-05-04T22:00:00.000+00:00",
            endTime: "2025-05-04T23:00:00.000+00:00",
            duration: 14708011,
            userId: "66692444bd1b937e34be213b",
            projectId: "67bd3154a7e4d1191bb8b336",
            taskId: "67bd646caf690dc0791f373b",
            companyId: "66692444bd1b937e34be2140",
            status: "in_progress",
            device: "mobile",
            manualReason: "",
            createdBy: "66692444bd1b937e34be213b",
            updatedBy: "66692444bd1b937e34be213b",
            timeManualStatus: "Pending",
            createdAt: "2025-03-21T08:57:54.001+00:00",
            updatedAt: "2025-03-21T13:03:01.011+00:00",
            generalDescription: "Update endTime and status by CRONJOB",
            offlineTime: null,
          },
        ])
      }, 5000)
    })
    /**
     * QUERY 
     * STARTTIME BETWEEN GTE startDateTimeFilter, LTE endDateTimeFilter
     * OR
     * ENDTIME BETWEEN GTE startDateTimeFilter, LTE endDateTimeFilter
     * AND
     * USERID = data?.userId
     * IF data.excludedIdTimetrack exists
     * THEN FILTER _id $ne: data.excludedIdTimetrack
     */
    // Passing data to next function
    let timeTrackData = await getTimetrackingData;
    if (data.excludedIdTimetrack){
      timeTrackData = timeTrackData.filter((e: timeTrackingData) => {
        return e._id !== data.excludedIdTimetrack
      })
    }
    return await this.validateManualTime({
      timeTrackingData: timeTrackData,
      startTime: data.startTime,
      endTime: data.endTime,
    });
  }

  validateManualTime(data: validateManualTimeType) {
    let isOverlapping: boolean = false;
    // once data from query is provided, then change startTime and endTime to UTC millis, and make it as range
    const startTimeMillis: number = new Date(data.startTime).getTime();
    const endTimeMillis: number = new Date(data.endTime).getTime();
    // create looping for checking every second if there is any conflict with sample query or not
    for (const p of data.timeTrackingData){
      // create range from millis
      const startTimeTrackMillis: number = new Date(p.startTime).getTime();
      const endTimeTrackMillis: number = new Date(p.endTime).getTime();
      const range: [number, number] = [startTimeTrackMillis, endTimeTrackMillis];
      // check if value isn't in between range
      if (
        (startTimeMillis >= range[0] && startTimeMillis < range[1]) ||
        (endTimeMillis > range[0] && endTimeMillis <= range[1]) ||
        (startTimeMillis < range[0] && endTimeMillis > range[1]) ||
        (startTimeMillis < range[0] && (endTimeMillis > range[0] && endTimeMillis <= range[1]))
      ){
        isOverlapping = true;
        return isOverlapping;
      }
    }
    return isOverlapping;
  }
}

const run = new ManualTime()

// CASE 1
console.log(run.collectSourceDataValidateManualTime({
  startTime: "2025-03-21T08:57:53.971+00:00",
  endTime: "2025-03-21T13:03:01.011+00:00",
  userId: "66692444bd1b937e34be213b",
}).then((data) => {
  console.log(`CASE 1 isOverlapping : `, data)
  // expected result
  if (data === true){
    console.log(`%c PASSED`, "color:green; font-size:20px;")
  } else {
    console.log('%c FAILED', "color:red; font-size:24px;")
  }
}));

// CASE 2
console.log(run.collectSourceDataValidateManualTime({
  startTime: "2025-03-21T08:57:53.971+00:00",
  endTime: "2025-03-22T13:03:01.011+00:00",
  userId: "66692444bd1b937e34be213b",
}).then((data) => {
  console.log(`CASE 2 isOverlapping : `, data)
  // expected result
  if (data === true){
    console.log(`%c PASSED`, "color:green; font-size:20px;")
  } else {
    console.log('%c FAILED', "color:red; font-size:24px;")
  }
}));

// CASE 3
console.log(run.collectSourceDataValidateManualTime({
  startTime: "2025-03-20T08:57:53.971+00:00",
  endTime: "2025-03-21T13:03:01.011+00:00",
  userId: "66692444bd1b937e34be213b",
}).then((data) => {
  console.log(`CASE 3 isOverlapping : `, data)
  // expected result
  if (data === true){
    console.log(`%c PASSED`, "color:green; font-size:20px;")
  } else {
    console.log('%c FAILED', "color:red; font-size:24px;")
  }
}));

// CASE 4
console.log(run.collectSourceDataValidateManualTime({
  startTime: "2025-03-18T08:57:53.971+00:00",
  endTime: "2025-03-19T13:03:01.011+00:00",
  userId: "66692444bd1b937e34be213b",
}).then((data) => {
  console.log(`CASE 4 isOverlapping : `, data)
  // expected result
  if (data === false){
    console.log(`%c PASSED`, "color:green; font-size:20px;")
  } else {
    console.log('%c FAILED', "color:red; font-size:24px;")
  }
}));

// CASE 5
console.log(run.collectSourceDataValidateManualTime({
  startTime: "2025-03-23T08:57:53.971+00:00",
  endTime: "2025-03-23T13:03:01.011+00:00",
  userId: "66692444bd1b937e34be213b",
}).then((data) => {
  console.log(`CASE 5 isOverlapping : `, data)
  // expected result
  if (data === false){
    console.log(`%c PASSED`, "color:green; font-size:20px;")
  } else {
    console.log('%c FAILED', "color:red; font-size:24px;")
  }
}));

// CASE 6
console.log(run.collectSourceDataValidateManualTime({
  startTime: "2025-03-20T08:57:53.971+00:00",
  endTime: "2025-03-21T08:57:53.971+00:00",
  userId: "66692444bd1b937e34be213b",
}).then((data) => {
  console.log(`CASE 6 isOverlapping : `, data)
  // expected result
  if (data === false){
    console.log("%c PASSED", "color:green; font-size:20px;")
  } else {
    console.log('%c FAILED', "color:red; font-size:24px;")
  }
}));

// CASE 7 (FULL OVERLAPPING CASE)
console.log(run.collectSourceDataValidateManualTime({
  startTime: "2025-03-21T08:54:53.971+00:00",
  endTime: "2025-03-21T13:06:01.011+00:00",
  userId: "66692444bd1b937e34be213b",
}).then((data) => {
  console.log(`CASE 7 isOverlapping : `, data)
  // expected result
  if (data === true){
    console.log(`%c PASSED`, "color:green; font-size:20px;")
  } else {
    console.log('%c FAILED', "color:red; font-size:24px;")
  }
}));

// CASE 8
console.log(run.collectSourceDataValidateManualTime({
  startTime: "2025-03-21T08:56:53.971+00:00",
  endTime: "2025-03-21T08:57:53.971+00:00",
  userId: "66692444bd1b937e34be213b",
}).then((data) => {
  console.log(`CASE 8 isOverlapping : `, data)
  // expected result
  if (data === false){
    console.log(`%c PASSED`, "color:green; font-size:20px;")
  } else {
    console.log('%c FAILED', "color:red; font-size:24px;")
  }
}));

// CASE 8B
console.log(run.collectSourceDataValidateManualTime({
  startTime: "2025-03-21T08:57:53.971+00:00",
  endTime: "2025-03-21T08:58:53.971+00:00",
  userId: "66692444bd1b937e34be213b",
}).then((data) => {
  console.log(`CASE 8B isOverlapping : `, data)
  // expected result
  if (data === true){
    console.log(`%c PASSED`, "color:green; font-size:20px;")
  } else {
    console.log('%c FAILED', "color:red; font-size:24px;")
  }
}));

// CASE 8C
console.log(run.collectSourceDataValidateManualTime({
  startTime: "2025-03-21T08:56:53.971+00:00",
  endTime: "2025-03-21T08:58:53.971+00:00",
  userId: "66692444bd1b937e34be213b",
}).then((data) => {
  console.log(`CASE 8C isOverlapping : `, data)
  // expected result
  if (data === true){
    console.log(`%c PASSED`, "color:green; font-size:20px;")
  } else {
    console.log('%c FAILED', "color:red; font-size:24px;")
  }
}));

// CASE 9
console.log(run.collectSourceDataValidateManualTime({
  startTime: "2025-03-21T13:03:01.011+00:00",
  endTime: "2025-03-21T13:04:01.011+00:00",
  userId: "66692444bd1b937e34be213b",
}).then((data) => {
  console.log(`CASE 9 isOverlapping : `, data)
  // expected result
  if (data === false){
    console.log(`%c PASSED`, "color:green; font-size:20px;")
  } else {
    console.log('%c FAILED', "color:red; font-size:24px;")
  }
}));

// CASE 9B
console.log(run.collectSourceDataValidateManualTime({
  startTime: "2025-03-21T13:02:01.011+00:00",
  endTime: "2025-03-21T13:04:01.011+00:00",
  userId: "66692444bd1b937e34be213b",
}).then((data) => {
  console.log(`CASE 9B isOverlapping : `, data)
  // expected result
  if (data === true){
    console.log(`%c PASSED`, "color:green; font-size:20px;")
  } else {
    console.log('%c FAILED', "color:red; font-size:24px;")
  }
}));

// only for row existing data 2 - 3
// CASE 10
console.log(run.collectSourceDataValidateManualTime({
  startTime: "2025-05-04T22:59:00.000+00:00",
  endTime: "2025-05-05T00:00:00.000+00:00",
  userId: "66692444bd1b937e34be213b",
}).then((data) => {
  console.log(`CASE 10 isOverlapping : `, data)
  // expected result
  if (data === true){
    console.log(`%c PASSED`, "color:green; font-size:20px;")
  } else {
    console.log('%c FAILED', "color:red; font-size:24px;")
  }
}));

// only for row existing data 2 - 3 and for logic exluding time track
// CASE 11
console.log(run.collectSourceDataValidateManualTime({
  startTime: "2025-05-04T22:59:00.000+00:00",
  endTime: "2025-05-05T00:00:00.000+00:00",
  userId: "66692444bd1b937e34be213b",
  excludedIdTimetrack: "67dd2a11ed77ca470f944bed",
}).then((data) => {
  console.log(`CASE 11 isOverlapping : `, data)
  // expected result
  if (data === false){
    console.log(`%c PASSED`, "color:green; font-size:20px;")
  } else {
    console.log('%c FAILED', "color:red; font-size:24px;")
  }
}));